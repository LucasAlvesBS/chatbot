import { IDateRange } from '@shared/interfaces';
import { DateTime } from 'luxon';

export function checkIntervalsOverlap(
  startA: DateTime,
  endA: DateTime,
  startB: DateTime,
  endB: DateTime,
) {
  return startA < endB && endA > startB;
}

export function getFreeBlocksInDay(
  workIntervals: IDateRange[],
  blockedIntervals: IDateRange[],
): IDateRange[] {
  const freeBlocks: IDateRange[] = [];

  for (const workInterval of workIntervals) {
    let blocks: IDateRange[] = [
      {
        start: workInterval.start,
        end: workInterval.end,
      },
    ];

    for (const blockedInterval of blockedIntervals) {
      blocks = blocks.flatMap((block) => {
        if (
          !checkIntervalsOverlap(
            block.start,
            block.end,
            blockedInterval.start,
            blockedInterval.end,
          )
        ) {
          return [block];
        }

        const result: IDateRange[] = [];

        if (blockedInterval.start > block.start) {
          result.push({
            start: block.start,
            end: blockedInterval.start,
          });
        }

        if (blockedInterval.end < block.end) {
          result.push({
            start: blockedInterval.end,
            end: block.end,
          });
        }

        return result;
      });
    }

    freeBlocks.push(...blocks);
  }

  return freeBlocks;
}
