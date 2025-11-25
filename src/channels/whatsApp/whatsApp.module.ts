import { ChatbotModule } from '@core/chatbot/chatbot.module';
import { Module } from '@nestjs/common';

import {
  ReceiveWhatsAppMessageController,
  ReceiveWhatsAppMessageService,
} from './contexts/receiveMessage';
import {
  VerifyWhatsAppWebhookController,
  VerifyWhatsAppWebhookService,
} from './contexts/verifyWebhook';

@Module({
  imports: [ChatbotModule],
  controllers: [
    ReceiveWhatsAppMessageController,
    VerifyWhatsAppWebhookController,
  ],
  providers: [ReceiveWhatsAppMessageService, VerifyWhatsAppWebhookService],
})
export class WhatsAppModule {}
