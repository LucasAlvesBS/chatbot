import env from '@config/env';
import { BullRootModuleOptions } from '@nestjs/bull';
import { BULL_MQ_PARAMETER } from '@shared/constants';

export const bullMQConfig: BullRootModuleOptions = {
  redis: {
    host: env().bullMQ.redis.host,
    port: env().bullMQ.redis.port,
    password: env().bullMQ.redis.password,
  },
  defaultJobOptions: {
    attempts: BULL_MQ_PARAMETER.ATTEMPTS,
    backoff: {
      type: BULL_MQ_PARAMETER.BACKOFF_TYPE,
      delay: BULL_MQ_PARAMETER.BACKOFF_DELAY,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};
