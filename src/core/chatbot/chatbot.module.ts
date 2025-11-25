import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';

import { ChatbotService } from './chatbot.service';

@Module({
  imports: [WhatsappProviderModule],
  controllers: [],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
