import {
  SelectAppointmentMonthViaWhatsAppService,
  SelectAppointmentWeekViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from '@core/chatbot/flows/whatsApp';
import { GetLocaleI18nForWhatsAppService } from '@core/i18n/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES, STARTS_WITH } from '@shared/constants';
import { IButtonStructure } from '@shared/interfaces';
import { IUnifiedMessage } from '@shared/interfaces';
import { GetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly sendWelcomeMenuViaWhatsAppService: SendWelcomeMenuViaWhatsAppService,
    private readonly selectAppointmentMonthViaWhatsAppService: SelectAppointmentMonthViaWhatsAppService,
    private readonly selectAppointmentWeekViaWhatsAppService: SelectAppointmentWeekViaWhatsAppService,
    private readonly getStateInSession: GetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
  ) {}

  async execute(unifiedMessage: IUnifiedMessage): Promise<void> {
    const { senderPhoneNumber, replyId } = unifiedMessage;

    const {
      welcome: { message: welcomeMessage, buttons },
    } = this.getLocaleI18nForWhatsAppService.execute(LOCALES.PT_BR);

    const state = await this.getStateInSession.execute(senderPhoneNumber);

    if (!state) {
      return this.sendWelcomeMenuViaWhatsAppService.execute(senderPhoneNumber, {
        message: welcomeMessage,
        buttons,
      });
    }

    switch (state) {
      case CACHE.MENU_SENT:
        return this.handleMenuSelection(replyId, senderPhoneNumber, buttons);

      case CACHE.SELECTED_MONTH:
      case CACHE.SELECTED_WEEK:
        if (replyId?.startsWith(STARTS_WITH.MONTH)) {
          return this.selectAppointmentWeekViaWhatsAppService.execute(
            senderPhoneNumber,
          );
        }
    }
  }

  private handleMenuSelection(
    replyId: string,
    phoneNumber: string,
    buttons: IButtonStructure[],
  ) {
    const scheduling = buttons[0].id;
    const cancellation = buttons[1].id;
    const humanService = buttons[2].id;

    switch (replyId) {
      case scheduling:
        return this.selectAppointmentMonthViaWhatsAppService.execute(
          phoneNumber,
        );

      case cancellation:
        console.log('flow_cancellation_started');
        return;

      case humanService:
        console.log('send_to_human');
        return;
    }
  }
}
