import { I18nModule } from '@core/i18n';
import { Module } from '@nestjs/common';
import { WhatsappProviderModule } from '@shared/providers';
import { SessionModule } from '@shared/redis';

import { WhatsAppChatbotService } from './channels/whatsApp/chatbot.service';
import { ScheduleAppointmentViaWhatsAppService } from './flows/whatsApp/scheduleAppointment/scheduleAppointment.service';

@Module({
  imports: [WhatsappProviderModule, SessionModule, I18nModule],
  providers: [WhatsAppChatbotService, ScheduleAppointmentViaWhatsAppService],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
