import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';
import { SessionModule } from '@shared/redis/session/session.module';

import { WhatsAppChatbotService } from './channels/whatsApp/chatbot.service';

@Module({
  imports: [WhatsappProviderModule, SessionModule],
  controllers: [],
  providers: [WhatsAppChatbotService],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
