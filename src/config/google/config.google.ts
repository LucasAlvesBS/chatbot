import env from '@config/env';
import { google } from 'googleapis';

export const googleOAuthConfig = new google.auth.OAuth2({
  client_id: env().google.clientId,
  client_secret: env().google.clientSecret,
  redirectUri: env().google.redirectUri,
});

googleOAuthConfig.setCredentials({
  refresh_token: env().google.refreshToken,
});
