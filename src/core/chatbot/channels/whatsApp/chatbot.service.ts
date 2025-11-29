import { ScheduleAppointmentViaWhatsAppService } from '@core/chatbot/flows/whatsApp';
import { GetLocaleI18nForWhatsAppService } from '@core/i18n/contexts';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES } from '@shared/constants';
import { ILocaleSchemaForWhatsApp } from '@shared/interfaces';
import { IButtonMessage, IUnifiedMessage } from '@shared/interfaces';
import { SendButtonsMessageService } from '@shared/providers/whatsApp';
import {
  GetStateInSessionService,
  SetStateInSessionService,
} from '@shared/redis/session';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly scheduleAppointmentViaWhatsAppService: ScheduleAppointmentViaWhatsAppService,
    private readonly getStateInSession: GetStateInSessionService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
  ) {}

  async execute(unifiedMessage: IUnifiedMessage): Promise<void> {
    const { senderPhoneNumber, message } = unifiedMessage;

    const { welcome } = this.getLocaleI18nForWhatsAppService.execute(
      LOCALES.PT_BR,
    );

    const state = await this.getStateInSession.execute(senderPhoneNumber);

    if (!state) {
      await Promise.all([
        this.sendWelcomeMenu(senderPhoneNumber, { welcome }),
        this.setStateInSession.execute(senderPhoneNumber, CACHE.MENU_SENT),
      ]);
    }

    const { buttons } = welcome;

    const scheduling = buttons[0].title;
    const cancellation = buttons[1].title;
    const humanService = buttons[2].title;

    switch (message) {
      case scheduling:
        return this.scheduleAppointmentViaWhatsAppService.execute(
          senderPhoneNumber,
        );

      case cancellation:
        console.log('flow_cancellation_started');

      case humanService:
        console.log('send_to_human');
    }
  }

  private async sendWelcomeMenu(to: string, locale: ILocaleSchemaForWhatsApp) {
    const message = locale.welcome.message;

    const buttonMessage: IButtonMessage = {
      to,
      message,
      buttons: locale.welcome.buttons,
    };

    await this.sendButtonsMessageService.execute(buttonMessage);
  }
}
