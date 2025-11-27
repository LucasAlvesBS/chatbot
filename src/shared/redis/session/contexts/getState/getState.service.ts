import { Inject, Injectable } from '@nestjs/common';
import { CACHE } from '@shared/constants';
import { PROVIDERS } from '@shared/constants/providers.constant';
import Redis from 'ioredis';

@Injectable()
export class GetStateInSessionService {
  constructor(
    @Inject(PROVIDERS.REDIS_CONNECTION) private readonly redis: Redis,
  ) {}

  async execute(user: string): Promise<string | null> {
    return this.redis.get(`${CACHE.CHAT_STATE}:${user}`);
  }
}
