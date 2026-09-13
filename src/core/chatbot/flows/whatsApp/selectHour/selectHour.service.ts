import env from '@config/env';
import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  REPLY_IDS,
  STATES,
  WHATSAPP_LISTS,
  WHATSAPP_MESSAGES,
  WHATSAPP_PARAMETER,
} from '@shared/constants';
import { buildWhatsAppRows } from '@shared/helpers';
import { IRowStructure } from '@shared/interfaces';
import { GetAvailableHoursInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';

@Injectable()
export class SelectHourViaWhatsAppService {
  constructor(
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly sendList: SendInteractiveListsMessageService,
    private readonly getAvailableHoursInCalendarService: GetAvailableHoursInCalendarService,
    private readonly setState: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string, replyId: string) {
    if (replyId.startsWith(REPLY_IDS.DAY)) {
      const [, day, month, year] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year);
    }

    if (replyId.startsWith(REPLY_IDS.HOUR_MORE)) {
      const [, , day, month, year, pageToken] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year, pageToken);
    }

    if (replyId.startsWith(REPLY_IDS.HOUR_PREV)) {
      const [, , day, month, year, pageToken] = replyId.split('_');
      return this.sendHoursList(phoneNumber, day, month, year, pageToken);
    }

    if (replyId.startsWith(REPLY_IDS.MONTH)) {
      return this.whatsAppChatbotService.execute({
        senderPhoneNumber: phoneNumber,
        replyId,
      });
    }

    if (replyId.startsWith(REPLY_IDS.HOUR)) {
      await this.setState.execute(phoneNumber, { state: STATES.SELECTED_HOUR });
      return this.whatsAppChatbotService.execute({
        senderPhoneNumber: phoneNumber,
        replyId,
      });
    }
  }

  private async sendHoursList(
    phoneNumber: string,
    day: string,
    month: string,
    year: string,
    pageToken?: string,
  ) {
    const page = pageToken ? Number(pageToken.replace('p', '')) : 1;

    const availableHours =
      await this.getAvailableHoursInCalendarService.execute(
        env().google.calendarId as string,
        day,
        month,
        year,
      );

    const rows = this.buildRows(availableHours, day, month, year, page);

    const message = WHATSAPP_MESSAGES.flow.scheduling.hourSelection;
    const hoursList = WHATSAPP_LISTS.hour;

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
    page: number,
  ): IRowStructure[] {
    const formattedDay = formatPadStart(day);
    const formattedMonth = formatPadStart(month);

    const defaultRows = WHATSAPP_LISTS.hour.section.defaultRows;

    return buildWhatsAppRows<string>(
      hours,
      page,
      WHATSAPP_PARAMETER.PAGE_SIZE,
      (item) => {
        const [hour, minute] = item.split(':');

        return {
          id: WHATSAPP_LISTS.hour.section.rowTemplate.id(
            hour,
            minute,
            formattedDay,
            formattedMonth,
            year,
          ),
          title: WHATSAPP_LISTS.hour.section.rowTemplate.title(hour, minute),
        };
      },
      {
        more: defaultRows.more(formattedDay, formattedMonth, year, page + 1),
        previous: defaultRows.previous(
          formattedDay,
          formattedMonth,
          year,
          page - 1,
        ),
        selectionReset: defaultRows.changeDay(formattedMonth, year),
      },
    );
  }
}
