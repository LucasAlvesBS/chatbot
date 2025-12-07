import env from '@config/env';
import { Injectable } from '@nestjs/common';
import { CALENDAR_PARAMETER } from '@shared/constants';
import { getFreeBlocksInDay, normalizeEvents } from '@shared/helpers';
import { DateTime } from 'luxon';

import { ListEventsInCalendarService } from '../listEvents';

@Injectable()
export class GetAvailableHoursInCalendarService {
  constructor(
    private readonly listEventsService: ListEventsInCalendarService,
  ) {}

  async execute(calendarId: string, day: string, month: string, year: string) {
    const nowISO = new Date().toISOString();
    const { data } = await this.listEventsService.execute(calendarId, nowISO);

    const normalizedEvents = normalizeEvents(data.items ?? []);

    const date = DateTime.fromObject({
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    if (date.weekday > 5) return [];

    const freeBlocks = getFreeBlocksInDay(date, normalizedEvents);

    const slotMinutes = env().business.consultationDuration;
    const availableHours: string[] = [];

    for (const block of freeBlocks) {
      let cursor = block.start;

      while (cursor.plus({ minutes: slotMinutes }) <= block.end) {
        availableHours.push(cursor.toFormat(CALENDAR_PARAMETER.HOUR_FORMART));
        cursor = cursor.plus({ minutes: slotMinutes });
      }
    }

    return availableHours;
  }
}
