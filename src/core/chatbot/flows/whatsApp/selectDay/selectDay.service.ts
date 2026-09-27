import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  DOCTOR_REGISTRATION_NUMBER,
  NOT_FOUND,
  PROVIDERS,
  REPLY_IDS,
  STATES,
  WHATSAPP_LISTS,
  WHATSAPP_MESSAGES,
  WHATSAPP_PARAMETER,
} from '@shared/constants';
import { buildWhatsAppRows } from '@shared/helpers';
import { IRowStructure, IWeekday } from '@shared/interfaces';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import {
  SendInteractiveListsMessageService,
  SendTextMessageService,
} from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { AppLogger, formatPadStart } from '@shared/utils';

import { GetAvailableDaysHelper } from '../helpers';

@Injectable()
export class SelectDayViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableDaysHelper: GetAvailableDaysHelper,
  ) {}

  async execute(
    phoneNumber: string,
    replyId: string,
    userName: string,
  ): Promise<void> {
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
      await this.setStateInSession.execute(phoneNumber, {
        state: STATES.REQUESTED_USER_NAME,
        userName,
      });

      return this.whatsAppChatbotService.execute({
        senderPhoneNumber: phoneNumber,
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

    const doctor =
      await this.db.repositories.doctorRepository.getByRegistrationNumber(
        DOCTOR_REGISTRATION_NUMBER,
      );

    if (!doctor) {
      AppLogger.error(NOT_FOUND('Doctor'));

      return this.sendTextMessageService.execute({
        to: phoneNumber,
        message: WHATSAPP_MESSAGES.errors.default,
      });
    }

    const availableDays = await this.getAvailableDaysHelper.execute(
      doctor.id,
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
