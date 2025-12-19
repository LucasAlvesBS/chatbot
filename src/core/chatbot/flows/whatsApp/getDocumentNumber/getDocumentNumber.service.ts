import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { Languages } from '@shared/enums';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GetDocumentNumberViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(
    phoneNumber: string,
    state: string,
    lang: Languages,
  ): Promise<void> {
    const message = this.i18nService.t('messages.request.documentNumber', {
      lang,
    });

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    await this.setStateInSession.execute(phoneNumber, {
      state,
    });
  }
}
