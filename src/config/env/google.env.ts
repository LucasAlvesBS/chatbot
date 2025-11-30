export const googleEnvs = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  calendarId: process.env.GOOGLE_CALENDAR_ID,
});
