export const businessEnvs = () => ({
  eventDuration: process.env.BUSINESS_EVENT_DURATION
    ? parseInt(process.env.BUSINESS_EVENT_DURATION)
    : 1,
  humanSupportPhoneNumber: process.env.BUSINESS_HUMAN_SUPPORT_PHONE_NUMBER,
});
