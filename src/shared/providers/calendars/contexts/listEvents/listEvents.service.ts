import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class ListEventsInCalendarService {
  constructor(
    @Inject(PROVIDERS.CALENDAR_PROVIDER)
    private readonly calendar: calendar_v3.Calendar,
  ) {}

  execute(calendarId: string, timeMin: string) {
    return this.calendar.events.list({
      calendarId,
      timeMin,
      singleEvents: true,
      orderBy: 'startTime',
    });
  }
}
