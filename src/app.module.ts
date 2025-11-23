import configuration from '@config/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WhatsAppModule } from './channels/index';
import { HealthModule } from './modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    WhatsAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
