import Bull from 'bull';

export const BULL_MQ_RETRY_CONFIG: Bull.JobOptions = {
  delay: 1000,
  attempts: 3,
};
