import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS, STATES, WHATSAPP_MESSAGES } from '@shared/constants';
import { IDatabaseProviders } from '@shared/modules/database/interfaces';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';
import {
  checkIfItIsValidCPF,
  formatDateWithLuxon,
  normalizeCPF,
} from '@shared/utils';

@Injectable()
export class GetUserNameViaWhatsAppService {
  constructor(
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
    @Inject(PROVIDERS.DATABASE_PROVIDER)
    private readonly db: IDatabaseProviders,
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

    if (event) {
      const messageArgs = formatDateWithLuxon(event.startDate);

      message = WHATSAPP_MESSAGES.alreadyHasActiveEvent(messageArgs);

      return this.sendTextMessageService.execute({
        to: phoneNumber,
        message,
      });
    }

    message = WHATSAPP_MESSAGES.request.userName;

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
