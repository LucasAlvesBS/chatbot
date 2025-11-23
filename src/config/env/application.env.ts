import { Envs } from '@shared/enums';

export const applicationEnvs = () => ({
  port: process.env.PORT ?? 3000,
  nodeEnv: (process.env.NODE_ENV as Envs) ?? Envs.DEV,
});
