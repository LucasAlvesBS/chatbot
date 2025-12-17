import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class DeleteEventInCalendarService {
  constructor(
    @Inject(PROVIDERS.CALENDAR_PROVIDER)
    private readonly calendar: calendar_v3.Calendar,
  ) {}

  execute(calendarId: string, eventId: string) {
    return this.calendar.events.delete({
      calendarId,
      eventId,
    });
  }
}
