import { bullMQConfig } from '@config/bullMQ';
import { Module } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants/providers.constant';
import Redis, { RedisOptions } from 'ioredis';

@Module({
  providers: [
    {
      provide: PROVIDERS.REDIS_CONNECTION,
      useFactory: () => {
        return new Redis(bullMQConfig.redis as RedisOptions);
      },
    },
  ],
  exports: [PROVIDERS.REDIS_CONNECTION],
})
export class RedisModule {}
