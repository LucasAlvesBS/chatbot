export interface IWhatsAppMessage {
  messagingProduct: string;
  to: string;
  type: string;
  text: {
    body: string;
  };
}
