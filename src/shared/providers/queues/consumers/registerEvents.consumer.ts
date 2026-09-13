import env from '@config/env';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import {
  CODE_MESSAGE,
  DOCTOR_REGISTRATION_NUMBER,
  EVENT_ALREADY_EXISTS_FOR,
  EVENT_REGTISTERED_FOR,
  PROVIDERS,
  QUEUE_NAMES,
  REGISTERING_EVENT_FOR,
  REGISTRATION_FAILED,
  WHATSAPP_MESSAGES,
} from '@shared/constants';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import {
  CreateEventInCalendarService,
  DeleteEventInCalendarService,
} from '@shared/providers/calendars';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';
import { Job } from 'bull';
import { DateTime } from 'luxon';
import { EntityManager } from 'typeorm';

import { RegisterEventConsumerRequest } from './types';

@Processor(QUEUE_NAMES.REGISTER_EVENT)
export class RegisterEventsConsumer {
  private readonly logger = new Logger(RegisterEventsConsumer.name);

  constructor(
    private readonly createEventInCalendarService: CreateEventInCalendarService,
    private readonly deleteEventInCalendarService: DeleteEventInCalendarService,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
  ) {}

  @Process()
  async execute(job: Job<RegisterEventConsumerRequest>) {
    const { phoneNumber, documentNumber, userName, i18nArgs, eventData } =
      job.data;

    this.logger.log(REGISTERING_EVENT_FOR(phoneNumber));

    let eventId: string = '';

    try {
      const doctor =
        await this.db.repositories.doctorRepository.getByRegistrationNumber(
          DOCTOR_REGISTRATION_NUMBER,
        );

      const defaultMessage = WHATSAPP_MESSAGES.flow.scheduling.errors.default;

      if (!doctor) {
        return this.sendTextMessageService.execute({
          to: phoneNumber,
          message: defaultMessage,
        });
      }

      const scheduledEventMessage =
        WHATSAPP_MESSAGES.flow.scheduling.scheduledEvent(i18nArgs);

      const startDateUTC = DateTime.fromISO(
        eventData.start?.dateTime as string,
        {
          setZone: true,
        },
      )
        .toUTC()
        .toJSDate();

      const idempotencyKey = `${doctor.id}:${startDateUTC.toISOString()}`;

      const hasEventByIdempotencyKey =
        await this.db.repositories.eventRepository.existsByIdempotencyKey(
          idempotencyKey,
        );

      if (hasEventByIdempotencyKey) {
        this.logger.log(EVENT_ALREADY_EXISTS_FOR(phoneNumber, idempotencyKey));

        return this.sendTextMessageService.execute({
          to: phoneNumber,
          message: scheduledEventMessage,
        });
      }

      const { data } = await this.createEventInCalendarService.execute(
        env().google.calendarId as string,
        eventData,
      );

      eventId = data.id as string;

      let patient =
        await this.db.repositories.patientRepository.getByDocumentNumber(
          documentNumber,
        );

      const entityManager = this.db.repositories.eventRepository.getManager();

      await entityManager.transaction(async (manager: EntityManager) => {
        if (!patient) {
          patient = await this.db.repositories.patientRepository.create(
            {
              documentNumber,
              name: userName,
            },
            manager,
          );
        }

        const hasEventByStartDate =
          await this.db.repositories.eventRepository.existsByStartDate(
            startDateUTC,
          );

        if (hasEventByStartDate) {
          throw new ConflictException(CODE_MESSAGE.EVENT_ALREADY_EXISTS);
        }

        await this.db.repositories.eventRepository.create(
          {
            referenceId: eventId,
            startDate: startDateUTC,
            idempotencyKey,
            doctor,
            patient,
          },
          manager,
        );
      });

      this.logger.log(EVENT_REGTISTERED_FOR(phoneNumber));

      await this.sendTextMessageService.execute({
        to: phoneNumber,
        message: scheduledEventMessage,
      });

      return this.clearStateInSessionService.execute(phoneNumber);
    } catch (error) {
      if (eventId) {
        await this.deleteEventInCalendarService.execute(
          env().google.calendarId as string,
          eventId,
        );
      }

      if (error instanceof ConflictException) {
        return this.sendTextMessageService.execute({
          to: phoneNumber,
          message: WHATSAPP_MESSAGES.flow.scheduling.errors.conflict,
        });
      }

      throw error;
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job<RegisterEventConsumerRequest>, error: Error) {
    const { phoneNumber } = job.data;

    this.logger.error(REGISTRATION_FAILED(phoneNumber, error?.message));

    const totalAttempts = job.opts.attempts ?? 1;
    const isLastAttempt = job.attemptsMade + 1 >= totalAttempts;

    if (!isLastAttempt) {
      return;
    }

    return this.sendTextMessageService.execute({
      to: phoneNumber,
      message: WHATSAPP_MESSAGES.flow.scheduling.errors.default,
    });
  }
}
