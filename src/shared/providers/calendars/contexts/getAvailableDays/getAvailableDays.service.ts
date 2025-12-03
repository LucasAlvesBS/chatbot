import { Injectable } from '@nestjs/common';
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

  async execute(calendarId: string, month: string, year: string) {
    const nowISO = new Date().toISOString();
    const { data } = await this.listEventsService.execute(calendarId, nowISO);
    const normalizedEvents = normalizeEvents(data.items ?? []);

    const monthDate = DateTime.fromObject({
      month: parseInt(month),
      year: parseInt(year),
    });
    const daysInMonth = monthDate.daysInMonth;

    const availableDays: IWeekday[] = [];

    for (let day = startDay(monthDate); day <= daysInMonth; day++) {
      const dayDate = monthDate.set({ day });

      if (dayDate.weekday > 5) continue;

      const dayEvents = normalizedEvents.filter(
        (event) =>
          event.start.year === dayDate.year &&
          event.start.month === dayDate.month &&
          event.start.day === dayDate.day,
      );

      const hasAvailability = checkIfThereIsAvailability(dayDate, dayEvents);

      if (hasAvailability) {
        availableDays.push({
          day,
          weekday: dayDate.setLocale('pt-BR').toFormat('cccc'),
        });
      }
    }

    return availableDays;
  }
}
