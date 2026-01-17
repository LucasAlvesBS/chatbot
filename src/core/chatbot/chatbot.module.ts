import { I18nModule } from '@core/i18n';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@shared/modules';
import {
  CalendarProviderModule,
  QueueProviderModule,
  WhatsAppProviderModule,
} from '@shared/providers';
import { SessionModule } from '@shared/redis/session';

import { WhatsAppChatbotService } from './channels/whatsApp';
import {
  CancelEventViaWhatsAppService,
  ConfirmCancellationOfEventViaWhatsAppService,
  GetDocumentNumberViaWhatsAppService,
  GetUserNameViaWhatsAppService,
  ProvideHumanSupportViaWhatsAppService,
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
    DatabaseModule,
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
    ConfirmCancellationOfEventViaWhatsAppService,
    CancelEventViaWhatsAppService,
    ProvideHumanSupportViaWhatsAppService,
  ],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
