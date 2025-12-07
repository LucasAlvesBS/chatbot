import env from '@config/env';
import { WhatsAppChatbotService } from '@core/chatbot/channels/whatsApp';
import { Injectable } from '@nestjs/common';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';

@Injectable()
export class ReceiveWhatsAppMessageService {
  constructor(private service: WhatsAppChatbotService) {}

  async execute(dto: ReceiveWhatsAppMessageRequestDTO): Promise<void> {
    const message = dto.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return;

    const from = message.from;
    const text =
      message.text?.body ||
      message.interactive?.buttonReply?.title ||
      message.interactive?.listReply?.title;
    const replyId =
      message.interactive?.buttonReply?.id ||
      message.interactive?.listReply?.id;

    if (from !== env().whatsApp.phoneNumber) return;

    await this.service.execute({
      senderPhoneNumber: from,
      message: text,
      ...(replyId && { replyId }),
    });
  }
}
