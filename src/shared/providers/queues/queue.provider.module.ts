import { bullMQConfig, bullMQQueuesToRegister } from '@config/bullMQ';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@shared/modules';
import { SessionModule } from '@shared/redis/session';

import { CalendarProviderModule } from '../calendars';
import { WhatsAppProviderModule } from '../whatsApp';
import { RegisterEventsConsumer } from './consumers';

@Module({
  imports: [
    BullModule.forRoot(bullMQConfig),
    BullModule.registerQueue(...bullMQQueuesToRegister),
    CalendarProviderModule,
    DatabaseModule,
    WhatsAppProviderModule,
    SessionModule,
  ],
  exports: [BullModule],
  providers: [RegisterEventsConsumer],
})
export class QueueProviderModule {}
