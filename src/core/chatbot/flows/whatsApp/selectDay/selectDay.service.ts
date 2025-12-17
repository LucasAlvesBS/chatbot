import env from '@config/env';
import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { I18nTranslations } from '@core/i18n/generated';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { REPLY_IDS, STATES, WHATSAPP_PARAMETER } from '@shared/constants';
import { Languages } from '@shared/enums';
import { buildWhatsAppRows } from '@shared/helpers';
import { IRowStructure, IWeekday } from '@shared/interfaces';
import { GetAvailableDaysInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SelectDayViaWhatsAppService {
  constructor(
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableDaysInCalendarService: GetAvailableDaysInCalendarService,
  ) {}

  async execute(
    phoneNumber: string,
    replyId: string,
    lang: Languages,
  ): Promise<void> {
    const defaultRowsPath: PathImpl2<I18nTranslations> =
      'lists.day.section.defaultRows';

    if (replyId.startsWith(REPLY_IDS.MONTH)) {
      const [, month, year] = replyId.split('_');
      return this.sendDaysList(phoneNumber, month, year, lang, defaultRowsPath);
    }

    if (replyId.startsWith(REPLY_IDS.DAY_MORE)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.sendDaysList(
        phoneNumber,
        month,
        year,
        lang,
        defaultRowsPath,
        pageToken,
      );
    }

    if (replyId.startsWith(REPLY_IDS.DAY_PREV)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.sendDaysList(
        phoneNumber,
        month,
        year,
        lang,
        defaultRowsPath,
        pageToken,
      );
    }

    const dayMonth = this.i18nService.t(defaultRowsPath, { lang })[2];

    if (replyId === dayMonth.id) {
      return this.whatsAppChatbotService.execute(
        { senderPhoneNumber: phoneNumber, replyId },
        lang,
      );
    }

    if (replyId.startsWith(REPLY_IDS.DAY)) {
      await this.setStateInSession.execute(phoneNumber, {
        state: STATES.SELECTED_DAY,
      });

      return this.whatsAppChatbotService.execute(
        { senderPhoneNumber: phoneNumber, replyId },
        lang,
      );
    }
  }

  private async sendDaysList(
    phoneNumber: string,
    month: string,
    year: string,
    lang: Languages,
    defaultRowsPath: PathImpl2<I18nTranslations>,
    pageToken?: string,
  ) {
    const page = pageToken ? Number(pageToken.replace('p', '')) : 1;

    const availableDays = await this.getAvailableDaysInCalendarService.execute(
      env().google.calendarId,
      month,
      year,
      lang,
    );

    const rows: IRowStructure[] = this.buildRows(
      availableDays,
      month,
      year,
      lang,
      page,
      defaultRowsPath,
    );

    const message = this.i18nService.t(
      'messages.flow.scheduling.daySelection',
      { lang },
    );

    const daysList = this.i18nService.t('lists.day', {
      lang,
    });

    await this.sendInteractiveListsMessageService.execute({
      to: phoneNumber,
      message,
      buttonLabel: daysList.buttonLabel,
      sections: [
        {
          title: daysList.section.title,
          rows,
        },
      ],
    });
  }

  private buildRows(
    availableDays: IWeekday[],
    month: string,
    year: string,
    lang: Languages,
    page: number,
    defaultRowsPath: PathImpl2<I18nTranslations>,
  ): IRowStructure[] {
    const formattedMonth = formatPadStart(month);

    return buildWhatsAppRows<IWeekday>(
      availableDays,
      page,
      WHATSAPP_PARAMETER.PAGE_SIZE,
      lang,
      this.i18nService,
      'lists.day.section.rowTemplate',
      defaultRowsPath,
      (item) => {
        return {
          args: {
            day: formatPadStart(item.day),
            month: formattedMonth,
            year,
          },
          description: item.weekday,
        };
      },
    );
  }
}
