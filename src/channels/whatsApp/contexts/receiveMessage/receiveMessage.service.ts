import { Injectable } from '@nestjs/common';
import { SendTextMessageProvider } from '@shared/providers/whatsApp/contexts/sendTextMessage';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';

@Injectable()
export class ReceiveWhatsAppMessageService {
  constructor(private provider: SendTextMessageProvider) {}

  async execute(payload: ReceiveWhatsAppMessageRequestDTO) {
    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return;

    const from = message.from;
    const text = message.text?.body || message.button?.text;

    await this.provider.execute(from, `Você disse: ${text}`);

    return { status: 'ok' };
  }
}
