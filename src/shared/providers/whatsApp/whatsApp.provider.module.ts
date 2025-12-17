import env from '@config/env';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SendButtonsMessageService } from './contexts/sendButtonsMessage';
import { SendInteractiveListsMessageService } from './contexts/sendInteractiveListsMessage';
import { SendTextMessageService } from './contexts/sendTextMessage';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => {
        return {
          baseURL: `${env().whatsApp.apiUrl}/${env().whatsApp.phoneNumberId}`,
          headers: {
            Authorization: `Bearer ${env().whatsApp.token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        };
      },
    }),
  ],
  providers: [
    SendTextMessageService,
    SendButtonsMessageService,
    SendInteractiveListsMessageService,
  ],
  exports: [
    SendTextMessageService,
    SendButtonsMessageService,
    SendInteractiveListsMessageService,
  ],
})
export class WhatsAppProviderModule {}
