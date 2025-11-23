import env from '@config/env';
import { BullRootModuleOptions } from '@nestjs/bull';
import { BULL_MQ_RETRY_CONFIG } from '@shared/constants';

export const bullMQConfig: BullRootModuleOptions = {
  redis: {
    host: env().bullMQ.redis.host,
    port: env().bullMQ.redis.port,
    password: env().bullMQ.redis.password,
  },
  defaultJobOptions: BULL_MQ_RETRY_CONFIG,
};
