import env from '@config/env';
import { Injectable } from '@nestjs/common';
import { STATES, WHATSAPP_LISTS, WHATSAPP_MESSAGES } from '@shared/constants';
import { IMonthYear } from '@shared/interfaces';
import { GetAvailableMonthsInCalendarService } from '@shared/providers/calendars';
import { SendInteractiveListsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class SelectMonthViaWhatsAppService {
  constructor(
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableMonthsInCalendarService: GetAvailableMonthsInCalendarService,
  ) {}

  async execute(phoneNumber: string, userName: string): Promise<void> {
    const allMonths = WHATSAPP_LISTS.month;

    const availableMonths =
      await this.getAvailableMonthsInCalendarService.execute(
        env().google.calendarId as string,
      );

    const filteredMonthRows = this.filterRowsFromAvailableMonths(
      allMonths.section.rows,
      availableMonths,
    );

    const message = WHATSAPP_MESSAGES.flow.scheduling.monthSelection;

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

    return this.setStateInSession.execute(phoneNumber, {
      state: STATES.SELECTED_MONTH,
      userName: userName.trim(),
    });
  }

  private filterRowsFromAvailableMonths(
    allMonthRows: readonly { id: string; title: string }[],
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
