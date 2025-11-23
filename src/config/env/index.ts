import 'dotenv/config';

export default () => ({
  application: {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  whatsApp: {
    token: process.env.WHATSAPP_TOKEN,
    apiUrl: process.env.WHATSAPP_API_URL,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  },
  google: {
    calendar: {},
    sheets: {},
  },
});
