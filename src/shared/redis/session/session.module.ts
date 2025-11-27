import { Module } from '@nestjs/common';

import { RedisModule } from '../redis.module';
import { ClearStateInSessionService } from './contexts/clearState';
import { GetStateInSessionService } from './contexts/getState';
import { SetStateInSessionService } from './contexts/setState';

@Module({
  imports: [RedisModule],
  providers: [
    GetStateInSessionService,
    SetStateInSessionService,
    ClearStateInSessionService,
  ],
  exports: [
    GetStateInSessionService,
    SetStateInSessionService,
    ClearStateInSessionService,
  ],
})
export class SessionModule {}
