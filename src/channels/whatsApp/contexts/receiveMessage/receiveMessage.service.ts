import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { Injectable } from '@nestjs/common';
import { Channels } from '@shared/enums';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';

@Injectable()
export class ReceiveWhatsAppMessageService {
  constructor(private service: WhatsAppChatbotService) {}

  async execute(dto: ReceiveWhatsAppMessageRequestDTO) {
    const message = dto.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return;

    const from = message.from;
    const text = message.text?.body || message.interactive?.buttonReply?.title;

    await this.service.execute({
      channel: Channels.WHATSAPP,
      senderPhoneNumber: from,
      message: text,
    });

    return { status: 'ok' };
  }
}
