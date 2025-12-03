import { IButtonStructure, IRowStructure } from './messages.interface';

export interface IMessageSchema {
  message: string;
}

export interface IButtonMessageSchema extends IMessageSchema {
  buttons: IButtonStructure[];
}

export interface ISchedulingStartedSchema {
  monthSelection: IMessageSchema;
  daySelection: IMessageSchema;
}

export interface ISectionSchema {
  title: string;
  rows: IRowStructure[];
}

export interface IInteractiveListSchema {
  buttonLabel: string;
  section: ISectionSchema;
}

export interface ILocaleSchemaForWhatsApp {
  welcome: IButtonMessageSchema;
  flow: {
    schedulingStarted: ISchedulingStartedSchema;
  };
  list: {
    month: IInteractiveListSchema;
    day: IInteractiveListSchema;
  };
}
