import env from '@config/env';
import { GetLocaleI18nForWhatsAppService } from '@core/i18n/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import {
  CACHE,
  LOCALES,
  STARTS_WITH,
  WHATSAPP_PARAMETER,
} from '@shared/constants';
import { IRowStructure, IWeekday } from '@shared/interfaces';
import { GetAvailableDaysInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';

import { SelectAppointmentMonthViaWhatsAppService } from '../selectAppointmentMonth';

@Injectable()
export class SelectAppointmentDayViaWhatsAppService {
  constructor(
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly selectAppointmentMonthViaWhatsAppService: SelectAppointmentMonthViaWhatsAppService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
    private readonly getAvailableDaysInCalendarService: GetAvailableDaysInCalendarService,
  ) {}

  async execute(phoneNumber: string, replyId: string): Promise<void> {
    const {
      flow: {
        schedulingStarted: {
          daySelection: { message },
        },
      },
      list: {
        day: { buttonLabel, section },
      },
    } = this.getLocaleI18nForWhatsAppService.execute(LOCALES.PT_BR);

    const { title: sectionTitle, rows } = section;

    const rowTemplateMap = new Map(rows.map((row) => [row.id, row]));

    if (replyId.startsWith(STARTS_WITH.MONTH)) {
      const monthYearByUnderline = replyId.replace(STARTS_WITH.MONTH, '');
      const [month, year] = monthYearByUnderline.split('_');

      return this.selectDaysForMessage(
        phoneNumber,
        month,
        year,
        message,
        buttonLabel,
        sectionTitle,
        rowTemplateMap,
      );
    }

    if (replyId.startsWith(STARTS_WITH.DAY_MORE)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.selectDaysForMessage(
        phoneNumber,
        month,
        year,
        message,
        buttonLabel,
        sectionTitle,
        rowTemplateMap,
        pageToken,
      );
    }

    if (replyId.startsWith(STARTS_WITH.DAY_PREV)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.selectDaysForMessage(
        phoneNumber,
        month,
        year,
        message,
        buttonLabel,
        sectionTitle,
        rowTemplateMap,
        pageToken,
      );
    }

    if (replyId === rowTemplateMap.get(STARTS_WITH.DAY_MONTH).id) {
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
    rowTemplateMap: Map<string, IRowStructure>,
    page = 1,
  ): IRowStructure[] {
    const pageSize = WHATSAPP_PARAMETER.PAGE_SIZE_FOR_DAYS;
    const total = availableDays.length;

    const { id: startsWithDayMoreId, title: dayMoreTitle } = rowTemplateMap.get(
      STARTS_WITH.DAY_MORE,
    );

    const { id: startsWithDayPrevId, title: dayPrevTitle } = rowTemplateMap.get(
      STARTS_WITH.DAY_PREV,
    );

    const { id: dayMonthId, title: dayMonthTitle } = rowTemplateMap.get(
      STARTS_WITH.DAY_MONTH,
    );

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

      return {
        id: `day_${formattedDay}_${formattedMonth}_${year}`,
        title: `${formattedDay}/${formattedMonth}/${year}`,
        description: item.weekday,
      };
    });

    const isFirst = page === 1;
    const isLast = page === totalPages;

    if (!isFirst) {
      const prevPage = page - 1;
      const dayPrevId = `${startsWithDayPrevId}_${formattedMonth}_${year}_p${prevPage}`;
      rows.push({ id: dayPrevId, title: dayPrevTitle });
    }

    if (!isLast) {
      const nextPage = page + 1;
      const dayMoreId = `${startsWithDayMoreId}_${formattedMonth}_${year}_p${nextPage}`;
      rows.push({ id: dayMoreId, title: dayMoreTitle });
    }

    rows.push({ id: dayMonthId, title: dayMonthTitle });

    return rows;
  }

  private async selectDaysForMessage(
    phoneNumber: string,
    month: string,
    year: string,
    message: string,
    buttonLabel: string,
    sectionTitle: string,
    rowTemplateMap: Map<string, IRowStructure>,
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
      rowTemplateMap,
      page,
    );

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
