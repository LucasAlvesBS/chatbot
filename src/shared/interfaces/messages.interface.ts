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

export interface IRowStructure {
  id: string;
  title: string;
  description?: string;
}

export interface ISectionStrucuture {
  title: string;
  rows: IRowStructure[];
}

export interface IInteractiveListMessage extends ISimpleMessage {
  buttonLabel: string;
  sections: ISectionStrucuture[];
  header?: string;
  footer?: string;
}
