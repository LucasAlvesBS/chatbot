import { IRowStructure } from '@shared/interfaces';

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
  formatRow: (item: T) => IRowStructure,
  defaultRows: {
    more: IRowStructure;
    previous: IRowStructure;
    selectionReset: IRowStructure;
  },
): IRowStructure[] {
  const pages = paginateWhatsApp(items, pageSize);

  if (pages.length === 0) return [];

  const totalPages = pages.length;
  const pageItems = pages[page - 1];

  const rows = pageItems.map((item) => formatRow(item));

  if (page > 1) {
    rows.push(defaultRows.previous);
  }

  if (page < totalPages) {
    rows.push(defaultRows.more);
  }

  rows.push(defaultRows.selectionReset);

  return rows;
}
