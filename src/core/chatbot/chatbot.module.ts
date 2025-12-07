import { I18nModule } from '@core/i18n';
import { Module } from '@nestjs/common';
import {
  CalendarProviderModule,
  WhatsappProviderModule,
} from '@shared/providers';
import { SessionModule } from '@shared/redis';

import { WhatsAppChatbotService } from './channels/whatsApp';
import {
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
  ],
  providers: [
    WhatsAppChatbotService,
    SendWelcomeMenuViaWhatsAppService,
    SelectDayViaWhatsAppService,
    SelectHourViaWhatsAppService,
    SelectMonthViaWhatsAppService,
  ],
  exports: [WhatsAppChatbotService],
})
export class ChatbotModule {}
