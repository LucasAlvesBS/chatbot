import Bull from 'bull';

export const BULL_MQ_RETRY_CONFIG: Bull.JobOptions = {
  delay: 1000,
  attempts: 3,
};

export const SESSION_PARAMETER = {
  CHAT_STATE_EXPIRATION: 3600,
};

export const CALENDAR_PARAMETER = {
  MONTHS_TO_DISPLAY: 5,
  NUMBER_OF_MONTHS_TO_CHECK_AVAILABILITY: 24,
  MONTH_NUMBER_FORMAT: 'MM',
};
