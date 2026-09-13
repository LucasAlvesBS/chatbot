import env from '@config/env';
import { Injectable } from '@nestjs/common';
import { WHATSAPP_MESSAGES } from '@shared/constants';
import { SendTextMessageService } from '@shared/providers/whatsApp';
import { ClearStateInSessionService } from '@shared/redis/session';

@Injectable()
export class ProvideHumanSupportViaWhatsAppService {
  constructor(
    private readonly sendTextMessageService: SendTextMessageService,
    private readonly clearStateInSessionService: ClearStateInSessionService,
  ) {}

  async execute(phoneNumber: string): Promise<void> {
    const message = WHATSAPP_MESSAGES.flow.humanSupport(phoneNumber);

    await this.sendTextMessageService.execute({
      to: env().business.humanSupportPhoneNumber as string,
      message,
    });

    return this.clearStateInSessionService.execute(phoneNumber);
  }
}
