import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS, WHATSAPP_HUB, WHATSAPP_WEBHOOK } from '@shared/constants';

import { VerifyWhatsAppWebhookService } from './verifyWebhook.service';

@Controller(WHATSAPP_WEBHOOK)
@ApiTags(API_TAGS.WHATSAPP)
export class VerifyWhatsAppWebhookController {
  constructor(private readonly service: VerifyWhatsAppWebhookService) {}

  @Get()
  index(
    @Query(WHATSAPP_HUB.MODE) mode: string,
    @Query(WHATSAPP_HUB.VERIFY_TOKEN) token: string,
    @Query(WHATSAPP_HUB.CHALLENGE) challenge: string,
  ) {
    return this.service.execute(mode, token, challenge);
  }
}
