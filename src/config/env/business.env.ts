export const businessEnvs = () => ({
  consultationDuration: process.env.BUSINESS_CONSULTATION_DURATION
    ? parseInt(process.env.BUSINESS_CONSULTATION_DURATION)
    : 1,
});
