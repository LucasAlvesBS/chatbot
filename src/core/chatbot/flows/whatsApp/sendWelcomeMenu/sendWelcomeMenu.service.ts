import { Injectable } from '@nestjs/common';
import { STATES, WHATSAPP_BUTTONS, WHATSAPP_MESSAGES } from '@shared/constants';
import { IButtonMessage } from '@shared/interfaces';
import { SendButtonsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class SendWelcomeMenuViaWhatsAppService {
  constructor(
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    const message = WHATSAPP_MESSAGES.welcome;
    const buttons = WHATSAPP_BUTTONS.homeMenu;

    const buttonMessage: IButtonMessage = {
      to: phoneNumber,
      message,
      buttons,
    };

    await this.sendButtonsMessageService.execute(buttonMessage);
    await this.setStateInSession.execute(phoneNumber, {
      state: STATES.MENU_SENT,
    });
  }
}
