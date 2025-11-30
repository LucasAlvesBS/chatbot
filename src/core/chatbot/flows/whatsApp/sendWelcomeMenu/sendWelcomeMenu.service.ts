import { Injectable } from '@nestjs/common';
import { CACHE } from '@shared/constants';
import { IButtonMessage, IButtonMessageSchema } from '@shared/interfaces';
import { SendButtonsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class SendWelcomeMenuViaWhatsAppService {
  constructor(
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(
    phoneNumber: string,
    { message, buttons }: IButtonMessageSchema,
  ): Promise<void> {
    const buttonMessage: IButtonMessage = {
      to: phoneNumber,
      message,
      buttons,
    };

    await this.sendButtonsMessageService.execute(buttonMessage);
    await this.setStateInSession.execute(phoneNumber, CACHE.MENU_SENT);
  }
}
