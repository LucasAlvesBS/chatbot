export const whatsAppEnvs = () => ({
  token: process.env.WHATSAPP_TOKEN,
  apiUrl: process.env.WHATSAPP_API_URL,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
});
