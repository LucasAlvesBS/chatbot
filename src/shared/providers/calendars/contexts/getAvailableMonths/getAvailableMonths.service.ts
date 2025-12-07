import { Injectable } from '@nestjs/common';
import { CALENDAR_PARAMETER } from '@shared/constants';
import { Languages } from '@shared/enums';
import { nowInBrazil } from '@shared/helpers';
import { IMonthYear } from '@shared/interfaces';

import { GetAvailableDaysInCalendarService } from '../getAvailableDays';

@Injectable()
export class GetAvailableMonthsInCalendarService {
  constructor(
    private readonly getAvailableDaysInCalendarService: GetAvailableDaysInCalendarService,
  ) {}

  async execute(
    calendarId: string,
    language: Languages,
  ): Promise<IMonthYear[]> {
    const currentDate = nowInBrazil();
    const availableMonths: IMonthYear[] = [];

    let cursor = 0;

    while (
      availableMonths.length < CALENDAR_PARAMETER.MONTHS_TO_DISPLAY &&
      cursor < CALENDAR_PARAMETER.NUMBER_OF_MONTHS_TO_CHECK_AVAILABILITY
    ) {
      const monthDate = currentDate.plus({ months: cursor });

      const month = monthDate.toFormat(CALENDAR_PARAMETER.MONTH_NUMBER_FORMAT);
      const year = monthDate.year.toString();

      const hasAvailableDays =
        await this.getAvailableDaysInCalendarService.execute(
          calendarId,
          month,
          year,
          language,
        );

      if (hasAvailableDays) {
        availableMonths.push({ month, year: monthDate.year });
      }

      cursor++;
    }

    return availableMonths;
  }
}
