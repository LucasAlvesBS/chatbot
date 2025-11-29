import { localesMapForWhatsApp } from '@core/i18n/locales/whatsApp';
import { LocaleCodeForWhatsApp } from '@core/i18n/types';
import { Injectable } from '@nestjs/common';
import { LOCALES } from '@shared/constants';
import { ILocaleSchemaForWhatsApp } from '@shared/interfaces';

@Injectable()
export class GetLocaleI18nForWhatsAppService {
  execute(code: LocaleCodeForWhatsApp): ILocaleSchemaForWhatsApp {
    return localesMapForWhatsApp[code] ?? localesMapForWhatsApp[LOCALES.PT_BR];
  }
}
