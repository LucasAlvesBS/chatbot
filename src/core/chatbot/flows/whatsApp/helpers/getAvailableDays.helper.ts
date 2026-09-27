import { Injectable } from '@nestjs/common';
import { IWeekday } from '@shared/interfaces';
import { DateTime, PossibleDaysInMonth } from 'luxon';

import { GetAvailableHoursHelper } from './getAvailableHours.helper';

@Injectable()
export class GetAvailableDaysHelper {
  constructor(
    private readonly getAvailableHoursHelper: GetAvailableHoursHelper,
  ) {}

  async execute(
    doctorId: string,
    month: string,
    year: string,
  ): Promise<IWeekday[]> {
    const date = DateTime.fromObject({
      month: Number(month),
      year: Number(year),
    });

    const availableDays: IWeekday[] = [];

    const daysInMonth = date.daysInMonth as PossibleDaysInMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = date.set({ day });

      const availableHours = await this.getAvailableHoursHelper.execute(
        doctorId,
        String(day),
        month,
        year,
      );

      if (!availableHours.length) {
        continue;
      }

      availableDays.push({
        day,
        weekday: dayDate.setLocale('pt-BR').toFormat('cccc'),
      });
    }

    return availableDays;
  }
}
