import { GetLocaleI18nForWhatsAppService } from '@core/i18n';
import { Injectable } from '@nestjs/common';
import { CACHE, LOCALES } from '@shared/constants';
import { ILocaleSchemaForWhatsApp } from '@shared/interfaces';
import { IButtonMessage, IUnifiedMessage } from '@shared/interfaces';
import { SendButtonsMessageProvider } from '@shared/providers/whatsApp/contexts/sendButtonsMessage';
import {
  GetStateInSessionService,
  SetStateInSessionService,
} from '@shared/redis/session';

@Injectable()
export class WhatsAppChatbotService {
  constructor(
    private readonly provider: SendButtonsMessageProvider,
    private readonly getStateInSession: GetStateInSessionService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly getLocaleI18nForWhatsAppService: GetLocaleI18nForWhatsAppService,
  ) {}

  async execute(unifiedMessage: IUnifiedMessage) {
    const { senderPhoneNumber, message } = unifiedMessage;

    const { welcome } = this.getLocaleI18nForWhatsAppService.execute(
      LOCALES.PT_BR,
    );

    const state = await this.getStateInSession.execute(senderPhoneNumber);

    if (!state) {
      await this.sendWelcomeMenu(senderPhoneNumber, { welcome });
      await this.setStateInSession.execute(senderPhoneNumber, CACHE.MENU_SENT);
      return { status: 'welcome_menu_sent' };
    }

    const { buttons } = welcome;

    const scheduling = buttons[0].title;
    const cancellation = buttons[1].title;
    const humanService = buttons[2].title;

    switch (message) {
      case scheduling:
        console.log('flow_scheduling_started');
        return { status: 'flow_scheduling_started' };

      case cancellation:
        console.log('flow_cancellation_started');
        return { status: 'flow_cancellation_started' };

      case humanService:
        console.log('send_to_human');
        return { status: 'send_to_human' };
    }

    return { status: 'ok' };
  }

  private async sendWelcomeMenu(to: string, locale: ILocaleSchemaForWhatsApp) {
    const message = locale.welcome.message;

    const buttonMessage: IButtonMessage = {
      to,
      message,
      buttons: locale.welcome.buttons.map((button) => ({
        id: button.id,
        title: button.title,
      })),
    };

    await this.provider.execute(buttonMessage);
  }
}
