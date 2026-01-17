import env from '@config/env';
import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { Languages } from '@shared/enums';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProvideHumanSupportViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(phoneNumber: string, lang: Languages): Promise<void> {
    const message = this.i18nService.t('messages.flow.humanSupport', {
      lang,
      args: { phoneNumber },
    });

    await this.sendTextMessageService.execute({
      to: env().business.humanSupportPhoneNumber,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
