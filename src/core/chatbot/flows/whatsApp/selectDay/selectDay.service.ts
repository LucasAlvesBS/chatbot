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
import { IRowStructure, IWeekday } from '@shared/interfaces';
import { GetAvailableDaysInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { formatPadStart } from '@shared/utils';

@Injectable()
export class SelectDayViaWhatsAppService {
  constructor(
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableDaysInCalendarService: GetAvailableDaysInCalendarService,
  ) {}

  async execute(phoneNumber: string, replyId: string): Promise<void> {
    if (replyId.startsWith(REPLY_IDS.MONTH)) {
      const [, month, year] = replyId.split('_');
      return this.sendDaysList(phoneNumber, month, year);
    }

    if (replyId.startsWith(REPLY_IDS.DAY_MORE)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.sendDaysList(phoneNumber, month, year, pageToken);
    }

    if (replyId.startsWith(REPLY_IDS.DAY_PREV)) {
      const [, , month, year, pageToken] = replyId.split('_');

      return this.sendDaysList(phoneNumber, month, year, pageToken);
    }

    const dayMonth = WHATSAPP_LISTS.day.section.defaultRows.changeMonth;

    if (replyId === dayMonth.id) {
      return this.whatsAppChatbotService.execute({
        senderPhoneNumber: phoneNumber,
        replyId,
      });
    }

    if (replyId.startsWith(REPLY_IDS.DAY)) {
      await this.setStateInSession.execute(phoneNumber, {
        state: STATES.SELECTED_DAY,
      });

      return this.whatsAppChatbotService.execute({
        senderPhoneNumber: phoneNumber,
        replyId,
      });
    }
  }

  private async sendDaysList(
    phoneNumber: string,
    month: string,
    year: string,
    pageToken?: string,
  ) {
    const page = pageToken ? Number(pageToken.replace('p', '')) : 1;

    const availableDays = await this.getAvailableDaysInCalendarService.execute(
      env().google.calendarId as string,
      month,
      year,
    );

    const rows: IRowStructure[] = this.buildRows(
      availableDays,
      month,
      year,
      page,
    );

    const message = WHATSAPP_MESSAGES.flow.scheduling.daySelection;
    const daysList = WHATSAPP_LISTS.day;

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
    page: number,
  ): IRowStructure[] {
    const formattedMonth = formatPadStart(month);

    const defaultRows = WHATSAPP_LISTS.day.section.defaultRows;

    return buildWhatsAppRows(
      availableDays,
      page,
      WHATSAPP_PARAMETER.PAGE_SIZE,
      (item) => ({
        id: WHATSAPP_LISTS.day.section.rowTemplate.id(
          formatPadStart(item.day),
          formattedMonth,
          year,
        ),
        title: WHATSAPP_LISTS.day.section.rowTemplate.title(
          formatPadStart(item.day),
          formattedMonth,
          year,
        ),
        description: item.weekday,
      }),
      {
        more: defaultRows.more(month, year, page + 1),
        previous: defaultRows.previous(month, year, page - 1),
        selectionReset: defaultRows.changeMonth,
      },
    );
  }
}
