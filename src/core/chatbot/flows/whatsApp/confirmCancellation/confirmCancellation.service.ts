import { I18nTranslations } from '@core/i18n/generated';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS, STATES } from '@shared/constants';
import { Languages } from '@shared/enums';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import {
  SendButtonsMessageService,
  SendTextMessageService,
} from '@shared/providers/whatsApp';
import {
  ClearStateInSessionService,
  SetStateInSessionService,
} from '@shared/redis/session';
import {
  checkIfItIsValidCPF,
  formatDateWithLuxon,
  normalizeCPF,
} from '@shared/utils';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ConfirmCancellationOfEventViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
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

    const event =
      await this.db.repositories.eventRepository.getByDocumentNumber(
        documentNumber,
      );

    if (!event) {
      message = this.i18nService.t('messages.flow.cancellation.eventNotFound', {
        lang,
      });

      await this.sendTextMessageService.execute({
        to: phoneNumber,
        message,
      });

      return this.clearStateInSessionService.execute(phoneNumber);
    }

    const i18nArgs = formatDateWithLuxon(event.startDate);

    message = this.i18nService.t('messages.flow.cancellation.eventFound', {
      lang,
      args: i18nArgs,
    });

    const buttons = this.i18nService.t('buttons.binary', { lang });

    await this.sendButtonsMessageService.execute({
      to: phoneNumber,
      message,
      buttons,
    });

    return this.setStateInSession.execute(phoneNumber, {
      state: STATES.CONFIRMED_EVENT_CANCELLATION,
      documentNumber,
      eventReferenceId: event.referenceId,
    });
  }
}
