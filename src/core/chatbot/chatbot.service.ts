import { Injectable } from '@nestjs/common';
import {
  CACHE,
  WELCOME_BUTTON_IDS,
  WELCOME_BUTTON_TITLES,
} from '@shared/constants';
import { IButtonMessage, IUnifiedMessage } from '@shared/interfaces';
import { SendButtonsMessageProvider } from '@shared/providers/whatsApp/contexts/sendButtonsMessage';
import {
  GetStateInSessionService,
  SetStateInSessionService,
} from '@shared/redis/session';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly provider: SendButtonsMessageProvider,
    private readonly getStateInSession: GetStateInSessionService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(input: IUnifiedMessage) {
    const { senderPhoneNumber, message } = input;

    const state = await this.getStateInSession.execute(senderPhoneNumber);
    console.log(state);
    console.log(message);
    if (!state) {
      await this.sendWelcomeMenu(senderPhoneNumber);
      await this.setStateInSession.execute(senderPhoneNumber, CACHE.MENU_SENT);
      return { status: 'welcome_menu_sent' };
    }

    if (message === WELCOME_BUTTON_TITLES.SCHEDULING) {
      console.log('flow_scheduling_started');
      return { status: 'flow_scheduling_started' };
    }

    if (message === WELCOME_BUTTON_TITLES.CANCELLATION) {
      console.log('flow_scheduling_started');
      return { status: 'flow_scheduling_started' };
    }

    if (message === WELCOME_BUTTON_TITLES.HUMAN_SERVICE) {
      console.log('send_to_human');
      return { status: 'send_to_human' };
    }

    return { status: 'ok' };
  }

  private async sendWelcomeMenu(to: string) {
    const message = 'Olá! Sou o recepcionista que vai lhe ajudar.';

    const buttonMessage: IButtonMessage = {
      to,
      message,
      buttons: [
        {
          id: WELCOME_BUTTON_IDS.SCHEDULING,
          title: WELCOME_BUTTON_TITLES.SCHEDULING,
        },
        {
          id: WELCOME_BUTTON_IDS.CANCELLATION,
          title: WELCOME_BUTTON_TITLES.CANCELLATION,
        },
        {
          id: WELCOME_BUTTON_IDS.HUMAN_SERVICE,
          title: WELCOME_BUTTON_TITLES.HUMAN_SERVICE,
        },
      ],
    };

    await this.provider.execute(buttonMessage);
  }
}
