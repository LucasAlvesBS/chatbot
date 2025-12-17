import env from '@config/env';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  CONSULTATION_DESCRIPTION,
  CONSULTATION_SUMMARY,
  QUEUE_NAMES,
  TIMEZONES,
} from '@shared/constants';
import { Languages } from '@shared/enums';
import { ClearStateInSessionService } from '@shared/redis/session';
import { Queue } from 'bull';
import { calendar_v3 } from 'googleapis';
import { DateTime } from 'luxon';

@Injectable()
export class ScheduleEventViaWhatsAppService {
  constructor(
    private readonly clearStateInSessionService: ClearStateInSessionService,
    @InjectQueue(QUEUE_NAMES.REGISTER_EVENT)
    private readonly registerEventQueue: Queue,
  ) {}

  async execute(
    phoneNumber: string,
    documentNumber: string,
    userName: string,
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

    const i18nArgs = {
      day,
      month,
      year,
      hour,
      minute,
    };

    const data = {
      phoneNumber,
      documentNumber,
      userName,
      i18nArgs,
      lang,
      eventData,
    };

    await this.registerEventQueue.add(data);

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
