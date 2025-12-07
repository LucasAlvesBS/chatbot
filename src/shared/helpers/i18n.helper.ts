import { I18nTranslations } from '@core/i18n/generated';
import { PathImpl2 } from '@nestjs/config';
import { Languages } from '@shared/enums';
import { I18nService } from 'nestjs-i18n';

export function getDefaultRowForWhatsApp(
  lang: Languages,
  i18nService: I18nService<I18nTranslations>,
  path: PathImpl2<I18nTranslations>,
  index: number,
  args?: Record<string, string>,
): { id: string; title: string } {
  const items = i18nService.t(path, {
    lang,
    ...(args ? { args } : {}),
  });

  return items[index];
}
