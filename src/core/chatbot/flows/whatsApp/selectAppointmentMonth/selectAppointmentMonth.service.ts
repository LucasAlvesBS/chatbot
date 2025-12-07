import env from '@config/env';
import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { CACHE } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IMonthYear } from '@shared/interfaces';
import { GetAvailableMonthsInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SelectAppointmentMonthViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableMonthsInCalendarService: GetAvailableMonthsInCalendarService,
  ) {}

  async execute(phoneNumber: string, lang: Languages): Promise<void> {
    const allMonths = this.i18nService.t('lists.month');

    const availableMonths =
      await this.getAvailableMonthsInCalendarService.execute(
        env().google.calendarId,
        lang,
      );

    const filteredMonthRows = this.filterRowsFromAvailableMonths(
      allMonths.section.rows,
      availableMonths,
    );

    const message = this.i18nService.t(
      'messages.flow.schedulingStarted.monthSelection',
      { lang },
    );

    await this.sendInteractiveListsMessageService.execute({
      to: phoneNumber,
      message,
      buttonLabel: allMonths.buttonLabel,
      sections: [
        {
          title: allMonths.section.title,
          rows: filteredMonthRows,
        },
      ],
    });

    return this.setStateInSession.execute(phoneNumber, CACHE.SELECTED_MONTH);
  }

  private filterRowsFromAvailableMonths(
    allMonthRows: Array<{ id: string; title: string }>,
    availableMonths: IMonthYear[],
  ) {
    return availableMonths.map((item) => {
      const row = allMonthRows[Number(item.month) - 1];

      return {
        ...row,
        id: `${row.id}_${item.year}`,
        description: item.year.toString(),
      };
    });
  }
}
