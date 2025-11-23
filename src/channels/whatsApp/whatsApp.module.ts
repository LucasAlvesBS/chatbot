import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';

import {
  ReceiveWhatsAppMessageController,
  ReceiveWhatsAppMessageService,
} from './contexts/receiveMessage';
import {
  VerifyWhatsAppWebhookController,
  VerifyWhatsAppWebhookService,
} from './contexts/verifyWebhook';

@Module({
  imports: [WhatsappProviderModule],
  controllers: [
    ReceiveWhatsAppMessageController,
    VerifyWhatsAppWebhookController,
  ],
  providers: [ReceiveWhatsAppMessageService, VerifyWhatsAppWebhookService],
})
export class WhatsAppModule {}
