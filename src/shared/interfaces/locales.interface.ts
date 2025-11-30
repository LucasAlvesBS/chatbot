import { IButtonStructure, IRowStructure } from './messages.interface';

export interface IButtonMessageSchema {
  message: string;
  buttons: IButtonStructure[];
}

export interface IInteractiveListMessageSchema {
  message: string;
  buttonLabel: string;
  section: {
    title: string;
    rows: IRowStructure[];
  };
}

export interface ISchedulingStartedSchema {
  monthSelection: IInteractiveListMessageSchema;
  weekSelection: IInteractiveListMessageSchema;
}

export interface ILocaleSchemaForWhatsApp {
  welcome: IButtonMessageSchema;
  flow: {
    schedulingStarted: ISchedulingStartedSchema;
  };
}
