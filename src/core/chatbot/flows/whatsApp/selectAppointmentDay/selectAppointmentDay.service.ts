import env from '@config/env';
import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { CACHE, STARTS_WITH, WHATSAPP_PARAMETER } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IRowStructure, IWeekday } from '@shared/interfaces';
import { GetAvailableDaysInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';
import { I18nService } from 'nestjs-i18n';

import { SelectAppointmentMonthViaWhatsAppService } from '../selectAppointmentMonth';

@Injectable()
export class SelectAppointmentDayViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly selectAppointmentMonthViaWhatsAppService: SelectAppointmentMonthViaWhatsAppService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableDaysInCalendarService: GetAvailableDaysInCalendarService,
  ) {}

  async execute(
    phoneNumber: string,
    replyId: string,
    lang: Languages,
  ): Promise<void> {
    console.log(replyId);
    if (replyId.startsWith(STARTS_WITH.MONTH)) {
      const monthYearByUnderline = replyId.replace(STARTS_WITH.MONTH, '');
      const [month, year] = monthYearByUnderline.split('_');

      return this.selectDaysForMessage(phoneNumber, month, year, lang);
    }

    if (replyId.startsWith(STARTS_WITH.DAY_MORE)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.selectDaysForMessage(
        phoneNumber,
        month,
        year,
        lang,
        pageToken,
      );
    }

    if (replyId.startsWith(STARTS_WITH.DAY_PREV)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.selectDaysForMessage(
        phoneNumber,
        month,
        year,
        lang,
        pageToken,
      );
    }

    const dayMonth = this.getDefaultRow(lang, 2);

    if (replyId === dayMonth.id) {
      return this.selectAppointmentMonthViaWhatsAppService.execute(phoneNumber);
    }

    if (replyId.startsWith(STARTS_WITH.DAY)) {
      return this.setStateInSession.execute(phoneNumber, CACHE.SELECTED_DAY);
    }
  }

  private filterRowsFromAvailableDays(
    availableDays: IWeekday[],
    month: string,
    year: string,
    lang: Languages,
    page = 1,
  ): IRowStructure[] {
    const pageSize = WHATSAPP_PARAMETER.PAGE_SIZE_FOR_DAYS;
    const total = availableDays.length;

    const pages: IWeekday[][] = [];
    let cursor = 0;

    if (total === 0) return [];

    pages.push(availableDays.slice(cursor, cursor + pageSize));
    cursor += pageSize;

    const middleSize = pageSize - 1;

    while (cursor < total) {
      pages.push(availableDays.slice(cursor, cursor + middleSize));
      cursor += middleSize;
    }

    const totalPages = pages.length;
    const pageItems = pages[page - 1];
    const formattedMonth = formatPadStart(month);

    const rows: IRowStructure[] = pageItems.map((item) => {
      const formattedDay = formatPadStart(item.day);

      const row = this.i18nService.t('lists.day.section.rowTemplate', {
        lang,
        args: { day: formattedDay, month: formattedMonth, year },
      });

      return {
        id: row.id,
        title: row.title,
        description: item.weekday,
      };
    });

    const isFirst = page === 1;
    const isLast = page === totalPages;

    if (!isFirst) {
      const dayPrev = this.getDefaultRow(lang, 1, {
        month: formattedMonth,
        year,
        page: String(page - 1),
      });

      rows.push({ id: dayPrev.id, title: dayPrev.title });
    }

    if (!isLast) {
      const dayMore = this.getDefaultRow(lang, 0, {
        month: formattedMonth,
        year,
        page: String(page + 1),
      });

      rows.push({ id: dayMore.id, title: dayMore.title });
    }

    const dayMonth = this.getDefaultRow(lang, 2);

    rows.push({ id: dayMonth.id, title: dayMonth.title });

    return rows;
  }

  private getDefaultRow(
    lang: Languages,
    index: number,
    args?: Record<string, string>,
  ) {
    const rows = this.i18nService.t('lists.day.section.defaultRows', {
      lang,
      ...(args ? { args } : {}),
    });

    return rows[index];
  }

  private async selectDaysForMessage(
    phoneNumber: string,
    month: string,
    year: string,
    lang: Languages,
    pageToken?: string,
  ) {
    const page = pageToken ? Number(pageToken.replace('p', '')) : 1;

    const availableDays = await this.getAvailableDaysInCalendarService.execute(
      env().google.calendarId,
      month,
      year,
    );

    const rows: IRowStructure[] = this.filterRowsFromAvailableDays(
      availableDays,
      month,
      year,
      lang,
      page,
    );

    const message = this.i18nService.t(
      'messages.flow.schedulingStarted.daySelection',
      { lang },
    );

    const buttonLabel = this.i18nService.t('lists.day.buttonLabel', {
      lang,
    });

    const sectionTitle = this.i18nService.t('lists.day.section.title', {
      lang,
    });

    await this.sendInteractiveListsMessageService.execute({
      to: phoneNumber,
      message,
      buttonLabel,
      sections: [
        {
          title: sectionTitle,
          rows,
        },
      ],
    });
  }
}
