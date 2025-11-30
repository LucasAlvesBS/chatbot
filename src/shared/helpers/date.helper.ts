import { TIMEZONES } from '@shared/constants';
import { DateTime } from 'luxon';

export const nowInBrazil = (): DateTime => {
  return DateTime.now().setZone(TIMEZONES.BRAZIL);
};

export const toBrazilDate = (iso: string): DateTime => {
  return DateTime.fromISO(iso, { zone: TIMEZONES.BRAZIL });
};
