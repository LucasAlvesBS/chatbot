import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS, WHATSAPP_WEBHOOK } from '@shared/constants';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';
import { ReceiveWhatsAppMessageService } from './receiveMessage.service';

@Controller(WHATSAPP_WEBHOOK)
@ApiTags(API_TAGS.WHATSAPP)
export class ReceiveWhatsAppMessageController {
  constructor(private readonly service: ReceiveWhatsAppMessageService) {}

  @Post()
  async index(@Body() body: ReceiveWhatsAppMessageRequestDTO) {
    return this.service.execute(body);
  }
}
