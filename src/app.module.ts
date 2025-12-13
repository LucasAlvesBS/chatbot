import configuration from '@config/env';
import { dataSourceOptions } from '@config/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatsAppModule } from './channels/index';
import { HealthModule } from './modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    HealthModule,
    WhatsAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
