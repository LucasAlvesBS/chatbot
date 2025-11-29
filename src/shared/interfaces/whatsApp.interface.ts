export interface IWhatsAppMessage {
  messagingProduct: string;
  to: string;
  type: string;
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

export interface IWhatsAppButtonsMessagePayload {
  messagingProduct: string;
  to: string;
  type: string;
  interactive: {
    type: string;
    body: { text: string };
    action: {
      buttons: IWhatsAppButton[];
    };
  };
}

export interface IWhatsAppInteractiveListPayload {
  to: string;
  type: string;
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
