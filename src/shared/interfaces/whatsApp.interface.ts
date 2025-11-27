export interface IWhatsAppMessage {
  messagingProduct: string;
  to: string;
  type: string;
  text: {
    body: string;
  };
}

export interface IWhatsAppButtonsMessage {
  messagingProduct: string;
  to: string;
  type: string;
  interactive: {
    type: string;
    body: { text: string };
    action: {
      buttons: {
        type: string;
        reply: {
          id: string;
          title: string;
        };
      }[];
    };
  };
}
