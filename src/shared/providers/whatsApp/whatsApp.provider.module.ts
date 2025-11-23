import env from '@config/env';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SendTextMessageProvider } from './contexts/sendTextMessage';

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
  providers: [SendTextMessageProvider],
  exports: [SendTextMessageProvider],
})
export class WhatsappProviderModule {}
