import { Injectable } from '@nestjs/common';
import { WHATSAPP_MESSAGES } from '@shared/constants';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { SetStateInSessionService } from '@shared/redis/session';

@Injectable()
export class GetDocumentNumberViaWhatsAppService {
  constructor(
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly setStateInSession: SetStateInSessionService,
  ) {}

  async execute(phoneNumber: string, state: string): Promise<void> {
    const message = WHATSAPP_MESSAGES.request.documentNumber;

    await this.sendTextMessageService.execute({
      to: phoneNumber,
      message,
    });

    await this.setStateInSession.execute(phoneNumber, {
      state,
    });
  }
}
