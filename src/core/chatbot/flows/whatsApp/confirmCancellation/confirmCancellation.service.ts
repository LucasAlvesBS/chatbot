import { Inject, Injectable } from '@nestjs/common';
import {
  PROVIDERS,
  STATES,
  WHATSAPP_BUTTONS,
  WHATSAPP_MESSAGES,
} from '@shared/constants';
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

@Injectable()
export class ConfirmCancellationOfEventViaWhatsAppService {
  constructor(
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly sendButtonsMessageService: SendButtonsMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(phoneNumber: string, documentNumber: string): Promise<void> {
    const normalizedDocumentNumber = normalizeCPF(documentNumber);
    const isDocumentNumber = checkIfItIsValidCPF(normalizedDocumentNumber);

    let message: string;

    if (!isDocumentNumber) {
      message = WHATSAPP_MESSAGES.invalid.documentNumber;
      return this.sendTextMessageService.execute({
        to: phoneNumber,
        message,
      });
    }

    const event =
      await this.db.repositories.consultationRepository.getByDocumentNumber(
        documentNumber,
      );

    if (!event) {
      message = WHATSAPP_MESSAGES.flow.cancellation.eventNotFound;

      await this.sendTextMessageService.execute({
        to: phoneNumber,
        message,
      });

      return this.clearStateInSessionService.execute(phoneNumber);
    }

    const messageArgs = formatDateWithLuxon(event.startDate);

    message = WHATSAPP_MESSAGES.flow.cancellation.eventFound(messageArgs);

    const buttons = WHATSAPP_BUTTONS.binary;

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
