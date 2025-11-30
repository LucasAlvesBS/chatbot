import { GetLocaleI18nForWhatsAppService } from '@core/i18n/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES } from '@shared/constants';
import { GetAvailableMonthsInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class SelectAppointmentWeekViaWhatsAppService {
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
          weekSelection: { message, buttonLabel, section },
        },
      },
    } = this.getLocaleI18nForWhatsAppService.execute(LOCALES.PT_BR);

    const allWeekRows = section.rows;

    await this.setStateInSession.execute(phoneNumber, CACHE.SELECTED_WEEK);
  }
}
