import env from '@config/env';
import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { I18nTranslations } from '@core/i18n/generated';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { REPLY_IDS, STATES, WHATSAPP_PARAMETER } from '@shared/constants';
import { Languages } from '@shared/enums';
import { buildWhatsAppRows } from '@shared/helpers';
import { IRowStructure } from '@shared/interfaces';
import { GetAvailableHoursInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SelectHourViaWhatsAppService {
  constructor(
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendList: SendInteractiveListsMessageService,
    private readonly getAvailableHoursInCalendarService: GetAvailableHoursInCalendarService,
    private readonly setState: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string, replyId: string, lang: Languages) {
    if (replyId.startsWith(REPLY_IDS.DAY)) {
      const [, day, month, year] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year, lang);
    }

    if (replyId.startsWith(REPLY_IDS.HOUR_MORE)) {
      const [, , day, month, year, pageToken] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year, lang, pageToken);
    }

    if (replyId.startsWith(REPLY_IDS.HOUR_PREV)) {
      const [, , day, month, year, pageToken] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year, lang, pageToken);
    }

    if (replyId.startsWith(REPLY_IDS.MONTH)) {
      return this.whatsAppChatbotService.execute(
        { senderPhoneNumber: phoneNumber, replyId },
        lang,
      );
    }

    if (replyId.startsWith(REPLY_IDS.HOUR)) {
      await this.setState.execute(phoneNumber, { state: STATES.SELECTED_HOUR });
      return this.whatsAppChatbotService.execute(
        { senderPhoneNumber: phoneNumber, replyId },
        lang,
      );
    }
  }

  private async sendHoursList(
    phoneNumber: string,
    day: string,
    month: string,
    year: string,
    lang: Languages,
    pageToken?: string,
  ) {
    const page = pageToken ? Number(pageToken.replace('p', '')) : 1;

    const availableHours =
      await this.getAvailableHoursInCalendarService.execute(
        env().google.calendarId,
        day,
        month,
        year,
      );

    const rows = this.buildRows(availableHours, day, month, year, lang, page);

    const message = this.i18nService.t(
      'messages.flow.scheduling.hourSelection',
      {
        lang,
      },
    );

    const hoursList = this.i18nService.t('lists.hour', {
      lang,
    });

    await this.sendList.execute({
      to: phoneNumber,
      message,
      buttonLabel: hoursList.buttonLabel,
      sections: [
        {
          title: hoursList.section.title,
          rows,
        },
      ],
    });
  }

  private buildRows(
    hours: string[],
    day: string,
    month: string,
    year: string,
    lang: Languages,
    page: number,
  ): IRowStructure[] {
    const formattedDay = formatPadStart(day);
    const formattedMonth = formatPadStart(month);

    return buildWhatsAppRows<string>(
      hours,
      page,
      WHATSAPP_PARAMETER.PAGE_SIZE,
      lang,
      this.i18nService,
      'lists.hour.section.rowTemplate',
      'lists.hour.section.defaultRows',
      (item) => {
        const [hour, minute] = item.split(':');

        return {
          args: {
            hour,
            minute,
            day: formattedDay,
            month: formattedMonth,
            year,
          },
        };
      },
    );
  }
}
