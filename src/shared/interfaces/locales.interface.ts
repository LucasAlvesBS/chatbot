import { IButtonStructure, IRowStructure } from './messages.interface';

export interface IButtonMessageSchema {
  message: string;
  buttons: IButtonStructure[];
}

export interface IInteractiveListMessageWithoutDescriptionSchema {
  message: string;
  buttonLabel: string;
  section: {
    title: string;
    rows: IRowStructure[];
  };
}

export interface ILocaleSchemaForWhatsApp {
  welcome?: IButtonMessageSchema;
  flow?: {
    schedulingStarted: IInteractiveListMessageWithoutDescriptionSchema;
  };
}
