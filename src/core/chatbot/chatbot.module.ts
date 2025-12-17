import { I18nModule } from '@core/i18n';
import { Module } from '@nestjs/common';
import {
  CalendarProviderModule,
  QueueProviderModule,
  WhatsAppProviderModule,
} from '@shared/providers';
import { SessionModule } from '@shared/redis';

import { WhatsAppChatbotService } from './channels/whatsApp';
import {
  GetDocumentNumberViaWhatsAppService,
  GetUserNameViaWhatsAppService,
  ScheduleEventViaWhatsAppService,
  SelectDayViaWhatsAppService,
  SelectHourViaWhatsAppService,
  SelectMonthViaWhatsAppService,
  SendWelcomeMenuViaWhatsAppService,
} from './flows/whatsApp';

@Module({
  imports: [
    WhatsAppProviderModule,
    SessionModule,
    I18nModule,
    CalendarProviderModule,
    QueueProviderModule,
  ],
  providers: [
    WhatsAppChatbotService,
    SendWelcomeMenuViaWhatsAppService,
    GetDocumentNumberViaWhatsAppService,
    GetUserNameViaWhatsAppService,
    SelectDayViaWhatsAppService,
    SelectHourViaWhatsAppService,
    SelectMonthViaWhatsAppService,
    ScheduleEventViaWhatsAppService,
  ],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
