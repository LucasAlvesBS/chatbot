import { bullMQConfig, bullMQQueuesToRegister } from '@config/bullMQ';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { CalendarProviderModule } from '../calendars/calendar.provider.module';
import { RegisterEventsConsumer } from './consumers';

@Module({
  imports: [
    BullModule.forRoot(bullMQConfig),
    BullModule.registerQueue(...bullMQQueuesToRegister),
    CalendarProviderModule,
  ],
  exports: [BullModule],
  providers: [RegisterEventsConsumer],
})
export class QueueProviderModule {}
