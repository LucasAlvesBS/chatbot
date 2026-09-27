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
import { IRowStructure } from '@shared/interfaces';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import {
  SendInteractiveListsMessageService,
  SendTextMessageService,
} from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { AppLogger, formatPadStart } from '@shared/utils';

import { GetAvailableHoursHelper } from '../helpers';

@Injectable()
export class SelectHourViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    @Inject(forwardRef(() => WhatsAppChatbotService))
    private readonly whatsAppChatbotService: WhatsAppChatbotService,
    private readonly sendList: SendInteractiveListsMessageService,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly getAvailableHoursHelper: GetAvailableHoursHelper,
    private readonly setState: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string, replyId: string, userName: string) {
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
      await this.setState.execute(phoneNumber, {
        state: STATES.SELECTED_MONTH,
        userName,
      });

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

    const availableHours = await this.getAvailableHoursHelper.execute(
      doctor.id,
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
