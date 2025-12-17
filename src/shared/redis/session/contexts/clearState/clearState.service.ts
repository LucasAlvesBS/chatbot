import { Inject, Injectable } from '@nestjs/common';
import { SESSIONS } from '@shared/constants';
import { PROVIDERS } from '@shared/constants';
import Redis from 'ioredis';

@Injectable()
export class ClearStateInSessionService {
  constructor(
    @Inject(PROVIDERS.REDIS_CONNECTION) private readonly redis: Redis,
  ) {}

  async execute(user: string): Promise<void> {
    await this.redis.del(`${SESSIONS.CHAT_STATE}:${user}`);
  }
}
