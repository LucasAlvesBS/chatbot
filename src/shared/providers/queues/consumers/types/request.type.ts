import { Languages } from '@shared/enums';
import { calendar_v3 } from 'googleapis';

export type RegisterEventConsumerRequest = {
  phoneNumber: string;
  documentNumber: string;
  userName: string;
  i18nArgs: {
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
  };
  lang: Languages;
  eventData: calendar_v3.Schema$Event;
};
