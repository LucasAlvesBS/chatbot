import { bullMQConfig, bullMQQueuesToRegister } from '@config/bullMQ';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { RegisterEventsConsumer } from './consumers';

@Module({
  imports: [
    BullModule.forRoot(bullMQConfig),
    BullModule.registerQueue(...bullMQQueuesToRegister),
  ],
  exports: [BullModule],
  providers: [RegisterEventsConsumer],
})
export class QueueModule {}
