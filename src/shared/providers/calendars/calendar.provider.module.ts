import { googleOAuthConfig } from '@config/google';
import { Module } from '@nestjs/common';
import { VERSIONS } from '@shared/constants';
import { PROVIDERS } from '@shared/constants';
import { google } from 'googleapis';

import { CreateEventInCalendarService } from './contexts/createEvent';
import { DeleteEventInCalendarService } from './contexts/deleteEvent';
import { GetAvailableMonthsInCalendarService } from './contexts/getAvailableMonths';
import { ListEventsInCalendarService } from './contexts/listEvents';

@Module({
  providers: [
    {
      provide: PROVIDERS.CALENDAR_PROVIDER,
      useFactory: () => {
        return google.calendar({
          version: VERSIONS.CALENDAR,
          auth: googleOAuthConfig,
        });
      },
    },
    CreateEventInCalendarService,
    DeleteEventInCalendarService,
    ListEventsInCalendarService,
    GetAvailableMonthsInCalendarService,
  ],
  exports: [
    CreateEventInCalendarService,
    DeleteEventInCalendarService,
    ListEventsInCalendarService,
    GetAvailableMonthsInCalendarService,
  ],
})
export class CalendarProviderModule {}
