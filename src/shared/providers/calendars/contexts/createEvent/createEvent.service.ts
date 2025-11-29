import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class CreateEventInCalendarService {
  constructor(
    @Inject(PROVIDERS.GOOGLE_CALENDAR)
    private readonly calendar: calendar_v3.Calendar,
  ) {}

  createEvent(calendarId: string, eventData: calendar_v3.Schema$Event) {
    return this.calendar.events.insert({
      calendarId,
      requestBody: eventData,
    });
  }
}
