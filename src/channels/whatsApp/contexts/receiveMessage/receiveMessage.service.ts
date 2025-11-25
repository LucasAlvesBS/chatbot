import { ChatbotService } from '@core/chatbot/chatbot.service';
import { Injectable } from '@nestjs/common';
import { Channels } from '@shared/enums';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';

@Injectable()
export class ReceiveWhatsAppMessageService {
  constructor(private service: ChatbotService) {}

  async execute(dto: ReceiveWhatsAppMessageRequestDTO) {
    const message = dto.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return;

    const from = message.from;
    const text = message.text?.body || message.button?.text;

    await this.service.execute({
      channel: Channels.WHATSAPP,
      from,
      message: text,
    });

    return { status: 'ok' };
  }
}
