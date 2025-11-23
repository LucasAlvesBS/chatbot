import env from '@config/env';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CODE_MESSAGE } from '@shared/constants';

@Injectable()
export class VerifyWhatsAppWebhookService {
  execute(mode: string, token: string, challenge: string) {
    if (mode !== 'subscribe' || token !== env().whatsApp.webhookVerifyToken) {
      throw new UnauthorizedException(CODE_MESSAGE.UNAUTHORIZED_PROCESS);
    }

    return challenge;
  }
}
