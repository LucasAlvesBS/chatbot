import env from '@config/env';
import { Inject, Injectable } from '@nestjs/common';
import { SESSIONS } from '@shared/constants';
import { PROVIDERS } from '@shared/constants';
import { IChatState } from '@shared/interfaces';
import Redis from 'ioredis';

import { GetStateInSessionService } from '../getState';

@Injectable()
export class SetStateInSessionService {
  constructor(
    @Inject(PROVIDERS.REDIS_CONNECTION) private readonly redis: Redis,
    private readonly getStateInSessionService: GetStateInSessionService,
  ) {}

  async execute(user: string, payload: Partial<IChatState>): Promise<void> {
    const current = await this.getStateInSessionService.execute(user);

    await this.redis.set(
      `${SESSIONS.CHAT_STATE}:${user}`,
      JSON.stringify({ ...current, ...payload }),
      'EX',
      env().bullMQ.redis.chatStateExpiration,
    );
  }
}
