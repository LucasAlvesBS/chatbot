import { I18nTranslations } from '@core/i18n/generated';
import { Injectable } from '@nestjs/common';
import { STATES } from '@shared/constants';
import { Languages } from '@shared/enums';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import { checkIfItIsValidCPF, normalizeCPF } from '@shared/utils';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GetUserNameViaWhatsAppService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(
    phoneNumber: string,
    documentNumber: string,
    lang: Languages,
  ): Promise<void> {
    const normalizedDocumentNumber = normalizeCPF(documentNumber);
    const isDocumentNumber = checkIfItIsValidCPF(normalizedDocumentNumber);

    let message: string;

    if (!isDocumentNumber) {
      message = this.i18nService.t('messages.invalid.documentNumber', { lang });
      return this.sendTextMessageService.execute({
        to: phoneNumber,
        message,
      });
    }

    message = this.i18nService.t('messages.request.userName', { lang });

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    return this.setStateInSession.execute(phoneNumber, {
      state: STATES.REQUESTED_USER_NAME,
      documentNumber: normalizedDocumentNumber,
    });
  }
}
