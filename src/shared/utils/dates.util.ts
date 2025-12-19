import { DATE_PARAMETER, TIMEZONES } from '@shared/constants';
import { DateTime } from 'luxon';

export function formatPadStart(value: string | number) {
  return String(value).padStart(2, '0');
}

export function formatDateWithLuxon(startDate: Date) {
  const dateTime = DateTime.fromJSDate(startDate, {
    zone: TIMEZONES.BRAZIL,
  });

  const i18nArgs = {
    day: dateTime.toFormat(DATE_PARAMETER.DAY_NUMBER_FORMAT),
    month: dateTime.toFormat(DATE_PARAMETER.MONTH_NUMBER_FORMAT),
    year: dateTime.toFormat(DATE_PARAMETER.YEAR_NUMBER_FORMAT),
    hour: dateTime.toFormat(DATE_PARAMETER.HOUR_NUMBER_FORMAT),
    minute: dateTime.toFormat(DATE_PARAMETER.MINUTE_NUMBER_FORMAT),
  };

  return i18nArgs;
}
