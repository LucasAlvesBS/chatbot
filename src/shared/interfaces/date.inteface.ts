import { DateTime } from 'luxon';

export interface IDateRange {
  start: DateTime<boolean>;
  end: DateTime<boolean>;
}
