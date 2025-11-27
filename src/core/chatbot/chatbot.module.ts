import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';
import { SessionModule } from '@shared/redis/session/session.module';

import { ChatbotService } from './chatbot.service';

@Module({
  imports: [WhatsappProviderModule, SessionModule],
  controllers: [],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
