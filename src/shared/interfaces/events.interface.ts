import { calendar_v3 } from 'googleapis';
import { DateTime } from 'luxon';

export interface INormalizedEvent {
  raw: calendar_v3.Schema$Event;
  start: DateTime;
  isAllDay: boolean;
}

export interface IMonthYear {
  month: string;
  year: number;
}
