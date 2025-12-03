import env from '@config/env';
import { IDateRange, INormalizedEvent } from '@shared/interfaces';
import { calendar_v3 } from 'googleapis';
import { DateTime } from 'luxon';

import { nowInBrazil, toBrazilDate } from './date.helper';

export function checkIntervalsOverlap(
  startA: DateTime,
  endA: DateTime,
  startB: DateTime,
  endB: DateTime,
) {
  return startA < endB && endA > startB;
}

export function getWorkdayIntervals(day: DateTime): IDateRange[] {
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

  for (const workInterval of workIntervals) {
    let freeBlocks: IDateRange[] = [
      { start: workInterval.start, end: workInterval.end },
    ];

    for (const event of eventIntervals) {
      freeBlocks = freeBlocks.flatMap((free) => {
        if (
          !checkIntervalsOverlap(free.start, free.end, event.start, event.end)
        ) {
          return [free];
        }

        const result = [];

        if (event.start > free.start) {
          result.push({ start: free.start, end: event.start });
        }

        if (event.end < free.end) {
          result.push({ start: event.end, end: free.end });
        }

        return result;
      });
    }

    const hasOneHour = freeBlocks.some((block) => {
      const diff = block.end.diff(block.start, 'minutes').minutes;
      return diff >= env().business.consultationDuration;
    });

    if (hasOneHour) {
      return true;
    }
  }

  return false;
}

export function normalizeEvents(
  events: calendar_v3.Schema$Event[],
): INormalizedEvent[] {
  const validEvents = events.filter(
    (event) => event.start?.dateTime || event.start?.date,
  );

  const mappedEvents = validEvents.map((event) => {
    const start = event.start.dateTime
      ? toBrazilDate(event.start.dateTime)
      : DateTime.fromISO(event.start.date).set({ hour: 0 });

    return {
      raw: event,
      start,
      isAllDay: Boolean(event.start.date),
    };
  });

  const futureEvents = mappedEvents.filter(
    (event) => event.start >= nowInBrazil(),
  );

  return futureEvents;
}
