import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CheckController, CheckService } from './contexts/check';

@Module({
  imports: [TerminusModule],
  controllers: [CheckController],
  providers: [CheckService],
})
export class HealthModule {}
