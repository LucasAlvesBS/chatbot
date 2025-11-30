import {
  IMonthYear,
  INormalizedEvent,
  IRowStructure,
} from '@shared/interfaces';
import { DateTime } from 'luxon';

import { toBrazilDate } from './date.helper';

export const filterMonthRowsFromLocale = (
  allMonthRows: Array<{ id: string; title: string }>,
  availableMonths: IMonthYear[],
): IRowStructure[] => {
  return availableMonths.map((item) => {
    const row = allMonthRows.find((row) => row.id === `month_${item.month}`);

    return {
      ...row,
      description: item.year.toString(),
    };
  });
};

export function checkIntervalsOverlap(
  startA: DateTime,
  endA: DateTime,
  startB: DateTime,
  endB: DateTime,
) {
  return startA < endB && endA > startB;
}

export function getWorkdayIntervals(day: DateTime) {
  return [
    {
      start: day.set({ hour: 8, minute: 0 }),
      end: day.set({ hour: 12, minute: 0 }),
    },
    {
      start: day.set({ hour: 13, minute: 0 }),
      end: day.set({ hour: 18, minute: 0 }),
    },
  ];
}

export function checkIfThereIsAvailability(
  day: DateTime,
  normlizedEvents: INormalizedEvent[],
): boolean {
  const workIntervals = getWorkdayIntervals(day);

  if (normlizedEvents.some((event) => event.isAllDay)) {
    return false;
  }

  const eventIntervals = normlizedEvents
    .filter((event) => !event.isAllDay && event.raw.end?.dateTime)
    .map((event) => {
      return { start: event.start, end: toBrazilDate(event.raw.end.dateTime) };
    });

  return workIntervals.some((work) => {
    const isBlocked = eventIntervals.some((event) =>
      checkIntervalsOverlap(work.start, work.end, event.start, event.end),
    );
    return !isBlocked;
  });
}
