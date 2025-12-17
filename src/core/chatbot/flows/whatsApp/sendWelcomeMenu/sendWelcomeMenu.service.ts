import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { STATES } from '@shared/constants';
import { IButtonMessage } from '@shared/interfaces';
import { SendButtonsMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SendWelcomeMenuViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    const message = this.i18nService.t('messages.welcome');
    const buttons = this.i18nService.t('buttons.homeMenu');

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
