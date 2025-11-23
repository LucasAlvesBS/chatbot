import { Process, Processor } from '@nestjs/bull';
import { BadGatewayException, Logger } from '@nestjs/common';
import {
  QUEUE_NAMES,
  REGISTERING_EVENT_FOR,
  REGISTRATION_FAILED,
} from '@shared/constants';
import { Job } from 'bull';

import { RegisterEventConsumerRequest } from './types';

@Processor(QUEUE_NAMES.REGISTER_EVENT)
export class RegisterEventsConsumer {
  private readonly logger = new Logger(RegisterEventsConsumer.name);

  @Process()
  async execute(job: Job<RegisterEventConsumerRequest>) {
    const { name, cpf } = job.data;
    this.logger.log(REGISTERING_EVENT_FOR(name, cpf));
    try {
      throw new Error('Not implemented yet');
    } catch (error) {
      this.logger.error(REGISTRATION_FAILED(name));
      throw new BadGatewayException(error.message);
    }
  }
}
