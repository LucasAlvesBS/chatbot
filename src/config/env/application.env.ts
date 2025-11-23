import { Envs } from '@shared/enums';

export const applicationEnvs = () => ({
  apiPort: process.env.API_PORT ?? 3000,
  nodeEnv: (process.env.NODE_ENV as Envs) ?? Envs.DEV,
});
