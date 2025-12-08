import env from '@config/env';
import { Process, Processor } from '@nestjs/bull';
import { BadGatewayException, Logger } from '@nestjs/common';
import {
  EVENT_REGTISTERED_FOR,
  QUEUE_NAMES,
  REGISTERING_EVENT_FOR,
  REGISTRATION_FAILED,
} from '@shared/constants';
import { CreateEventInCalendarService } from '@shared/providers/calendars';
import { Job } from 'bull';

import { RegisterEventConsumerRequest } from './types';

@Processor(QUEUE_NAMES.REGISTER_EVENT)
export class RegisterEventsConsumer {
  private readonly logger = new Logger(RegisterEventsConsumer.name);

  constructor(
    private readonly createEventInCalendarService: CreateEventInCalendarService,
  ) {}

  @Process()
  async execute(job: Job<RegisterEventConsumerRequest>) {
    const { phoneNumber, eventData } = job.data;

    this.logger.log(REGISTERING_EVENT_FOR(phoneNumber));

    try {
      await this.createEventInCalendarService.createEvent(
        env().google.calendarId,
        eventData,
      );

      this.logger.log(EVENT_REGTISTERED_FOR(phoneNumber));
    } catch (error) {
      this.logger.error(REGISTRATION_FAILED(phoneNumber));
      throw new BadGatewayException(error.message);
    }
  }
}
