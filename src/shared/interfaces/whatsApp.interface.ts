export interface IWhatsAppDefaultPayload {
  messagingProduct: string;
  to: string;
  type: string;
}

export interface IWhatsAppMessage extends IWhatsAppDefaultPayload {
  text: {
    body: string;
  };
}

export interface IWhatsAppButton {
  type: string;
  reply: {
    id: string;
    title: string;
  };
}

export interface IWhatsAppButtonsMessagePayload
  extends IWhatsAppDefaultPayload {
  interactive: {
    type: string;
    body: { text: string };
    action: {
      buttons: IWhatsAppButton[];
    };
  };
}

export interface IWhatsAppInteractiveListPayload
  extends IWhatsAppDefaultPayload {
  interactive: {
    type: string;
    header?: {
      type: string;
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      button: string;
      sections: IWhatsAppListSection[];
    };
  };
}

export interface IWhatsAppListSection {
  title: string;
  rows: IWhatsAppListRow[];
}

export interface IWhatsAppListRow {
  id: string;
  title: string;
  description?: string;
}
