import { calendar_v3 } from 'googleapis';

export type RegisterEventConsumerRequest = {
  phoneNumber: string;
  eventData: calendar_v3.Schema$Event;
};
