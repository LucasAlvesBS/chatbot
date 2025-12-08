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

export function getEventsForDay(
  date: DateTime,
  events: INormalizedEvent[],
): INormalizedEvent[] {
  return events.filter((event) => event.start.hasSame(date, 'day'));
}

export function getFreeBlocksInDay(
  day: DateTime,
  events: INormalizedEvent[],
): IDateRange[] {
  const filteredEvents = getEventsForDay(day, events);
  const workIntervals = getWorkdayIntervals(day);

  if (filteredEvents.some((event) => event.isAllDay)) {
    return [];
  }

  const eventIntervals = filteredEvents
    .filter((event) => !event.isAllDay && event.raw.end?.dateTime)
    .map((event) => {
      return { start: event.start, end: toBrazilDate(event.raw.end.dateTime) };
    });

  const freeBlocks: IDateRange[] = [];

  for (const workInterval of workIntervals) {
    let blocks: IDateRange[] = [
      { start: workInterval.start, end: workInterval.end },
    ];

    for (const event of eventIntervals) {
      blocks = blocks.flatMap((block) => {
        if (
          !checkIntervalsOverlap(block.start, block.end, event.start, event.end)
        ) {
          return [block];
        }

        const result = [];

        if (event.start > block.start) {
          result.push({ start: block.start, end: event.start });
        }

        if (event.end < block.end) {
          result.push({ start: event.end, end: block.end });
        }

        return result;
      });
    }

    freeBlocks.push(...blocks);
  }

  return freeBlocks;
}

export function checkIfThereIsAvailability(
  day: DateTime,
  events: INormalizedEvent[],
): boolean {
  const freeBlocks = getFreeBlocksInDay(day, events);

  return freeBlocks.some((block) => {
    const diff = block.end.diff(block.start, 'minutes').minutes;
    return diff >= env().business.eventDuration;
  });
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
