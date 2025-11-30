import { Inject, Injectable } from '@nestjs/common';
import { CACHE, SESSION_PARAMETER } from '@shared/constants';
import { PROVIDERS } from '@shared/constants';
import Redis from 'ioredis';

@Injectable()
export class SetStateInSessionService {
  constructor(
    @Inject(PROVIDERS.REDIS_CONNECTION) private readonly redis: Redis,
  ) {}

  async execute(user: string, state: string): Promise<void> {
    await this.redis.set(
      `${CACHE.CHAT_STATE}:${user}`,
      state,
      'EX',
      SESSION_PARAMETER.CHAT_STATE_EXPIRATION,
    );
  }
}
