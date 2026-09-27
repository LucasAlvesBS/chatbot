import { Inject, Injectable } from '@nestjs/common';
import {
  CALENDAR_PARAMETER,
  DATE_PARAMETER,
  DOCTOR_REGISTRATION_NUMBER,
  NOT_FOUND,
  PROVIDERS,
  STATES,
  WHATSAPP_LISTS,
  WHATSAPP_MESSAGES,
} from '@shared/constants';
import { nowInBrazil } from '@shared/helpers';
import { IMonthYear } from '@shared/interfaces';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import {
  SendInteractiveListsMessageService,
  SendTextMessageService,
} from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { AppLogger } from '@shared/utils';

import { GetAvailableDaysHelper } from '../helpers';

@Injectable()
export class SelectMonthViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly sendInteractiveListsMessageService: SendInteractiveListsMessageService,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getAvailableDaysHelper: GetAvailableDaysHelper,
  ) {}

  async execute(phoneNumber: string, userName: string): Promise<void> {
    const allMonths = WHATSAPP_LISTS.month;

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

    const availableMonths = await this.getAvailableMonths(doctor.id);

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

  private async getAvailableMonths(doctorId: string): Promise<IMonthYear[]> {
    const currentDate = nowInBrazil();
    const availableMonths: IMonthYear[] = [];
    let cursor = 0;

    while (
      availableMonths.length < CALENDAR_PARAMETER.MONTHS_TO_DISPLAY &&
      cursor < CALENDAR_PARAMETER.NUMBER_OF_MONTHS_TO_CHECK_AVAILABILITY
    ) {
      const monthDate = currentDate.plus({ months: cursor });
      const month = monthDate.toFormat(DATE_PARAMETER.MONTH_NUMBER_FORMAT);
      const year = monthDate.year;

      const hasAvailableDays = await this.getAvailableDaysHelper.execute(
        doctorId,
        month,
        year.toString(),
      );

      if (hasAvailableDays) {
        availableMonths.push({
          month,
          year,
        });
      }

      cursor++;
    }

    return availableMonths;
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
