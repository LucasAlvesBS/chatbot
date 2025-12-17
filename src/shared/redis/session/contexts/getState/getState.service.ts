import { Inject, Injectable } from '@nestjs/common';
import { SESSIONS } from '@shared/constants';
import { PROVIDERS } from '@shared/constants';
import { IChatState } from '@shared/interfaces';
import Redis from 'ioredis';

@Injectable()
export class GetStateInSessionService {
  constructor(
    @Inject(PROVIDERS.REDIS_CONNECTION) private readonly redis: Redis,
  ) {}

  async execute(user: string): Promise<IChatState | null> {
    const data = await this.redis.get(`${SESSIONS.CHAT_STATE}:${user}`);
    return data ? JSON.parse(data) : null;
  }
}
