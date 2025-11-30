import env from '@config/env';
import { GetLocaleI18nForWhatsAppService } from '@core/i18n/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES } from '@shared/constants';
import { filterMonthRowsFromLocale } from '@shared/helpers';
import { GetAvailableMonthsInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class SelectAppointmentMonthViaWhatsAppService {
  constructor(
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
    private readonly getAvailableMonthsInCalendarService: GetAvailableMonthsInCalendarService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    const {
      flow: {
        schedulingStarted: {
          monthSelection: { message, buttonLabel, section },
        },
      },
    } = this.getLocaleI18nForWhatsAppService.execute(LOCALES.PT_BR);

    const allMonthRows = section.rows;

    const availableMonths =
      await this.getAvailableMonthsInCalendarService.execute(
        env().google.calendarId,
      );

    const filteredMonthRows = filterMonthRowsFromLocale(
      allMonthRows,
      availableMonths,
    );

    await this.sendInteractiveListsMessageService.execute({
      to: phoneNumber,
      message,
      buttonLabel,
      sections: [
        {
          title: section.title,
          rows: filteredMonthRows,
        },
      ],
    });

    await this.setStateInSession.execute(phoneNumber, CACHE.SELECTED_MONTH);
  }
}
