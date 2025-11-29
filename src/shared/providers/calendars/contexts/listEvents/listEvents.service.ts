import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class ListEventsInCalendarService {
  constructor(
    @Inject(PROVIDERS.GOOGLE_CALENDAR)
    private readonly calendar: calendar_v3.Calendar,
  ) {}

  execute(calendarId: string) {
    return this.calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: 'startTime',
    });
  }
}
