import { Module } from '@nestjs/common';

import { GetLocaleI18nForWhatsAppService } from './contexts/getLocale/whatsApp';

@Module({
  providers: [GetLocaleI18nForWhatsAppService],
  exports: [GetLocaleI18nForWhatsAppService],
})
export class I18nModule {}
