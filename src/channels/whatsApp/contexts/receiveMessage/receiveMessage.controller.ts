import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS, WHATSAPP_WEBHOOK } from '@shared/constants';
import { plainToInstance } from 'class-transformer';
import { camelKeys } from 'js-convert-case';

import { ReceiveWhatsAppMessageRequestDTO } from './dtos';
import { ReceiveWhatsAppMessageService } from './receiveMessage.service';

@Controller(WHATSAPP_WEBHOOK)
@ApiTags(API_TAGS.WHATSAPP)
export class ReceiveWhatsAppMessageController {
  constructor(private readonly service: ReceiveWhatsAppMessageService) {}

  @Post()
  async index(@Body() body: ReceiveWhatsAppMessageRequestDTO): Promise<void> {
    const normalized = camelKeys(body, {
      recursive: true,
      recursiveInArray: true,
    });

    const dto = plainToInstance(ReceiveWhatsAppMessageRequestDTO, normalized, {
      excludeExtraneousValues: true,
    });

    return this.service.execute(dto);
  }
}
