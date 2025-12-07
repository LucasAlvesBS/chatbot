import { Injectable } from '@nestjs/common';
import { CALENDAR_PARAMETER, LOCALES } from '@shared/constants';
import { Languages } from '@shared/enums';
import {
  checkIfThereIsAvailability,
  normalizeEvents,
  startDay,
} from '@shared/helpers';
import { IWeekday } from '@shared/interfaces';
import { DateTime } from 'luxon';

import { ListEventsInCalendarService } from '../listEvents';

@Injectable()
export class GetAvailableDaysInCalendarService {
  constructor(
    private readonly listEventsService: ListEventsInCalendarService,
  ) {}

  async execute(
    calendarId: string,
    month: string,
    year: string,
    language: Languages,
  ) {
    const nowISO = new Date().toISOString();
    const { data } = await this.listEventsService.execute(calendarId, nowISO);
    const normalizedEvents = normalizeEvents(data.items ?? []);

    const date = DateTime.fromObject({
      month: Number(month),
      year: Number(year),
    });
    const daysInMonth = date.daysInMonth;

    const availableDays: IWeekday[] = [];

    for (let day = startDay(date); day <= daysInMonth; day++) {
      const dayDate = date.set({ day });

      if (dayDate.weekday > 5) continue;

      const hasAvailability = checkIfThereIsAvailability(
        dayDate,
        normalizedEvents,
      );

      if (hasAvailability) {
        availableDays.push({
          day,
          weekday: dayDate
            .setLocale(LOCALES[language])
            .toFormat(CALENDAR_PARAMETER.WEEKDAY_FORMAT),
        });
      }
    }

    return availableDays;
  }
}
