import env from '@config/env';
import { Inject, Injectable } from '@nestjs/common';
import { DATE_PARAMETER, PROVIDERS } from '@shared/constants';
import { DayOfWeek } from '@shared/enums';
import { getFreeBlocksInDay } from '@shared/helpers';
import { IDateRange } from '@shared/interfaces';
import { DoctorSchedule, Holiday } from '@shared/modules/database/entities';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import { setToDateTime } from '@shared/utils';
import { DateTime } from 'luxon';

@Injectable()
export class GetAvailableHoursHelper {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
  ) {}

  async execute(
    doctorId: string,
    day: string,
    month: string,
    year: string,
  ): Promise<string[]> {
    const date = DateTime.fromObject({
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    const startDate = date.startOf('day').toJSDate();
    const endDate = date.plus({ days: 1 }).startOf('day').toJSDate();

    const [schedules, exceptions, holidays, consultations] = await Promise.all([
      this.db.repositories.doctorScheduleRepository.getByDoctorId(doctorId),

      this.db.repositories.agendaExceptionRepository.getByDoctorIdAndPeriod(
        doctorId,
        startDate,
        endDate,
      ),

      this.db.repositories.holidayRepository.getByPeriod(startDate, endDate),

      this.db.repositories.consultationRepository.getByDoctorIdAndPeriod(
        doctorId,
        startDate,
        endDate,
      ),
    ]);

    const workIntervals = this.getWorkIntervals(date, schedules);

    if (!workIntervals.length) {
      return [];
    }

    if (this.isHoliday(date, holidays)) {
      return [];
    }

    const blockedIntervals = [
      ...exceptions.map((exception) => ({
        start: setToDateTime(exception.startDate),
        end: setToDateTime(exception.endDate),
      })),

      ...consultations.map((consultation) => ({
        start: setToDateTime(consultation.startDate),
        end: setToDateTime(consultation.startDate).plus({
          minutes: env().business.eventDuration,
        }),
      })),
    ];

    const freeBlocks = getFreeBlocksInDay(workIntervals, blockedIntervals);

    const slotMinutes = env().business.eventDuration;

    const availableHours: string[] = [];

    for (const block of freeBlocks) {
      let cursor = block.start;

      while (cursor.plus({ minutes: slotMinutes }) <= block.end) {
        availableHours.push(
          cursor.toFormat(DATE_PARAMETER.HOUR_MINUTE_FORMART),
        );

        cursor = cursor.plus({
          minutes: slotMinutes,
        });
      }
    }

    return availableHours;
  }

  private getDayOfWeek(day: DateTime): DayOfWeek {
    const daysOfWeek: DayOfWeek[] = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    return daysOfWeek[day.weekday - 1];
  }

  private setTime(date: DateTime, time: string): DateTime {
    const [hour, minute] = time.split(':').map(Number);

    return date.set({
      hour,
      minute,
      second: 0,
      millisecond: 0,
    });
  }

  private getWorkIntervals(
    day: DateTime,
    schedules: DoctorSchedule[],
  ): IDateRange[] {
    const dayOfWeek = this.getDayOfWeek(day);

    return schedules
      .filter((schedule) => schedule.dayOfWeek === dayOfWeek)
      .map((schedule) => ({
        start: this.setTime(day, schedule.startTime),
        end: this.setTime(day, schedule.endTime),
      }));
  }

  private isHoliday(day: DateTime, holidays: Holiday[]): boolean {
    return holidays.some((holiday) =>
      DateTime.fromJSDate(holiday.date).hasSame(day, 'day'),
    );
  }
}
