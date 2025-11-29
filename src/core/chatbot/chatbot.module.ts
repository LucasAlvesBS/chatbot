import { I18nModule } from '@core/i18n/i18n.module';
import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';
import { SessionModule } from '@shared/redis/session/session.module';

import { WhatsAppChatbotService } from './channels/whatsApp/chatbot.service';

@Module({
  imports: [WhatsappProviderModule, SessionModule, I18nModule],
  controllers: [],
  providers: [WhatsAppChatbotService],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
