import { Injectable } from '@nestjs/common';
import { SendTextMessageProvider } from '@shared/providers/whatsApp/contexts/sendTextMessage';

import { IUnifiedMessage } from './interfaces';

@Injectable()
export class ChatbotService {
  constructor(private readonly provider: SendTextMessageProvider) {}

  async execute(input: IUnifiedMessage) {
    const { from, message } = input;

    await this.provider.execute(from, `Você disse: ${message}`);

    return { status: 'received' };
  }
}
