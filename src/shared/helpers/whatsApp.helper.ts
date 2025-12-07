import { I18nTranslations } from '@core/i18n/generated';
import { PathImpl2 } from '@nestjs/config';
import { Languages } from '@shared/enums';
import { IRowStructure } from '@shared/interfaces';
import { I18nService } from 'nestjs-i18n';

export function paginateWhatsApp<T>(items: T[], pageSize: number): T[][] {
  const total = items.length;
  if (total === 0) return [];

  const pages: T[][] = [];
  let cursor = 0;

  pages.push(items.slice(cursor, cursor + pageSize));
  cursor += pageSize;

  const middleSize = pageSize - 1;

  while (cursor < total) {
    pages.push(items.slice(cursor, cursor + middleSize));
    cursor += middleSize;
  }

  return pages;
}

export function buildWhatsAppRows<T>(
  items: T[],
  page: number,
  pageSize: number,
  lang: Languages,
  i18nService: I18nService<I18nTranslations>,
  i18nRowTemplatePath: PathImpl2<I18nTranslations>,
  i18nDefaultRowsPath: PathImpl2<I18nTranslations>,
  formatArgs: (item: T) => {
    args: Record<string, string>;
    description?: string;
  },
): IRowStructure[] {
  const pages = paginateWhatsApp(items, pageSize);
  if (pages.length === 0) return [];

  const totalPages = pages.length;
  const pageItems = pages[page - 1];

  let globalArgs: Record<string, string>;

  const rows: IRowStructure[] = pageItems.map((item) => {
    const { args, description: itemDescription } = formatArgs(item);
    globalArgs = args;

    const row = i18nService.t(i18nRowTemplatePath, {
      lang,
      args,
    }) as IRowStructure;

    return {
      id: row.id,
      title: row.title,
      description: itemDescription ?? row.description ?? undefined,
    };
  });

  const isFirst = page === 1;
  const isLast = page === totalPages;

  if (!isFirst) {
    const prev = i18nService.t(i18nDefaultRowsPath, {
      lang,
      args: { ...globalArgs, page: String(page - 1) },
    })[1];

    rows.push(prev);
  }

  if (!isLast) {
    const next = i18nService.t(i18nDefaultRowsPath, {
      lang,
      args: { ...globalArgs, page: String(page + 1) },
    })[0];

    rows.push(next);
  }

  const selectionReset = i18nService.t(i18nDefaultRowsPath, {
    lang,
    args: globalArgs,
  })[2];

  rows.push(selectionReset);

  return rows;
}
