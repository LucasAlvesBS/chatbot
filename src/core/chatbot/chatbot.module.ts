import { I18nModule } from '@core/i18n';
import { Module } from '@nestjs/common';
import {
  CalendarProviderModule,
  QueueProviderModule,
  WhatsappProviderModule,
} from '@shared/providers';
import { SessionModule } from '@shared/redis';

import { WhatsAppChatbotService } from './channels/whatsApp';
import {
  ScheduleEventViaWhatsAppService,
  SelectDayViaWhatsAppService,
  SelectHourViaWhatsAppService,
  SelectMonthViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from './flows/whatsApp';

@Module({
  imports: [
    WhatsappProviderModule,
    SessionModule,
    I18nModule,
    CalendarProviderModule,
    QueueProviderModule,
  ],
  providers: [
    WhatsAppChatbotService,
    SendWelcomeMenuViaWhatsAppService,
    SelectDayViaWhatsAppService,
    SelectHourViaWhatsAppService,
    SelectMonthViaWhatsAppService,
    ScheduleEventViaWhatsAppService,
  ],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
