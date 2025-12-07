export interface IUnifiedMessage {
  senderPhoneNumber: string;
  message?: string;
  replyId?: string;
}

export interface ISimpleMessage {
  to: string;
  message: string;
}

export interface IButtonStructure {
  id: string;
  title: string;
}

export interface IButtonMessage extends ISimpleMessage {
  buttons: IButtonStructure[];
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
