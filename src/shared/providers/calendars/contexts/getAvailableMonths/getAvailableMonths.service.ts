import { Injectable } from '@nestjs/common';
import { CALENDAR_PARAMETER } from '@shared/constants';
import {
  checkIfThereIsAvailability,
  normalizeEvents,
  nowInBrazil,
  startDay,
} from '@shared/helpers';
import { IMonthYear, INormalizedEvent } from '@shared/interfaces';
import { DateTime } from 'luxon';

import { ListEventsInCalendarService } from '../listEvents';

@Injectable()
export class GetAvailableMonthsInCalendarService {
  constructor(
    private readonly listEventsService: ListEventsInCalendarService,
  ) {}

  async execute(calendarId: string): Promise<IMonthYear[]> {
    const nowISO = new Date().toISOString();
    const { data } = await this.listEventsService.execute(calendarId, nowISO);
    const events = data.items ?? [];
    const normalizedEvents = normalizeEvents(events);

    const currentDate = nowInBrazil();
    const availableMonths: IMonthYear[] = [];

    let cursor = 0;

    while (
      availableMonths.length < CALENDAR_PARAMETER.MONTHS_TO_DISPLAY &&
      cursor < CALENDAR_PARAMETER.NUMBER_OF_MONTHS_TO_CHECK_AVAILABILITY
    ) {
      const monthDate = currentDate.plus({ months: cursor });
      const monthNumber = monthDate.toFormat(
        CALENDAR_PARAMETER.MONTH_NUMBER_FORMAT,
      );

      const monthEvents = normalizedEvents.filter(
        (event) =>
          event.start.month === monthDate.month &&
          event.start.year === monthDate.year,
      );

      const hasAvailability = await this.checkAvailabilityInMonth(
        monthDate,
        monthEvents,
      );

      if (hasAvailability) {
        availableMonths.push({ month: monthNumber, year: monthDate.year });
      }

      cursor++;
    }

    return availableMonths;
  }

  private async checkAvailabilityInMonth(
    monthDate: DateTime,
    events: INormalizedEvent[],
  ): Promise<boolean> {
    for (let day = startDay(monthDate); day <= monthDate.daysInMonth; day++) {
      const dayDate = monthDate.set({ day });

      const dayEvents = events.filter(
        (event) => event.start.day === dayDate.day,
      );

      const hasAvailability = checkIfThereIsAvailability(dayDate, dayEvents);

      if (hasAvailability) {
        return true;
      }
    }

    return false;
  }
}
