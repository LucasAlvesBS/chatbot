import { Channels } from '@shared/enums';

export interface IUnifiedMessage {
  channel: Channels;
  senderPhoneNumber: string;
  message: string;
}

export interface ISimpleMessage {
  to: string;
  message: string;
}

export interface IButtonMessage extends ISimpleMessage {
  buttons: {
    id: string;
    title: string;
  }[];
}
