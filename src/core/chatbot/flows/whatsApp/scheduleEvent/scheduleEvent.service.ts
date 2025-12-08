import env from '@config/env';
import { I18nTranslations } from '@core/i18n/generated';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  CONSULTATION_DESCRIPTION,
  CONSULTATION_SUMMARY,
  QUEUE_NAMES,
  TIMEZONES,
} from '@shared/constants';
import { Languages } from '@shared/enums';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';
import { Queue } from 'bull';
import { calendar_v3 } from 'googleapis';
import { DateTime } from 'luxon';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ScheduleEventViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
    @InjectQueue(QUEUE_NAMES.REGISTER_EVENT)
    private readonly registerEventQueue: Queue,
  ) {}

  async execute(
    phoneNumber: string,
    replyId: string,
    lang: Languages,
  ): Promise<void> {
    const [, hour, minute, day, month, year] = replyId.split('_');

    const startDate = DateTime.fromObject(
      {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
      },
      { zone: TIMEZONES.BRAZIL },
    );

    const endDate = startDate.plus({ minutes: env().business.eventDuration });

    const eventData: calendar_v3.Schema$Event = {
      summary: CONSULTATION_SUMMARY(phoneNumber),
      description: CONSULTATION_DESCRIPTION,
      start: {
        dateTime: startDate.toISO(),
        timeZone: TIMEZONES.BRAZIL,
      },
      end: {
        dateTime: endDate.toISO(),
        timeZone: TIMEZONES.BRAZIL,
      },
      reminders: {
        useDefault: false,
        overrides: [],
      },
    };

    const data = { phoneNumber, eventData };

    await this.registerEventQueue.add(data);

    const message = this.i18nService.t(
      'messages.flow.scheduling.scheduledEvent',
      {
        lang,
        args: {
          day,
          month,
          year,
          hour,
          minute,
        },
      },
    );

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
