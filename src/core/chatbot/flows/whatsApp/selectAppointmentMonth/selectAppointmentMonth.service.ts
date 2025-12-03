import env from '@config/env';
import { GetLocaleI18nForWhatsAppService } from '@core/i18n/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES, STARTS_WITH } from '@shared/constants';
import { IMonthYear, IRowStructure } from '@shared/interfaces';
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
          monthSelection: { message },
        },
      },
      list: {
        month: { buttonLabel, section },
      },
    } = this.getLocaleI18nForWhatsAppService.execute(LOCALES.PT_BR);

    const allMonthRows = section.rows;

    const availableMonths =
      await this.getAvailableMonthsInCalendarService.execute(
        env().google.calendarId,
      );

    const filteredMonthRows = this.filterRowsFromAvailableMonths(
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

    return this.setStateInSession.execute(phoneNumber, CACHE.SELECTED_MONTH);
  }

  private filterRowsFromAvailableMonths(
    allMonthRows: Array<{ id: string; title: string }>,
    availableMonths: IMonthYear[],
  ): IRowStructure[] {
    return availableMonths.map((item) => {
      const row = allMonthRows.find(
        (row) => row.id === `${STARTS_WITH.MONTH}${item.month}`,
      );

      return {
        ...row,
        id: `${row.id}_${item.year}`,
        description: item.year.toString(),
      };
    });
  }
}
