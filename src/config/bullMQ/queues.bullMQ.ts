import { BullModuleOptions } from '@nestjs/bull';
import { QUEUE_NAMES } from '@shared/constants';

export const bullMQQueuesToRegister: BullModuleOptions[] = [
  {
    name: QUEUE_NAMES.REGISTER_EVENT,
  },
];
