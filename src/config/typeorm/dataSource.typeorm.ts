import env from '@config/env';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: env().database.host,
  port: env().database.port ? parseInt(env().database.port, 10) : 5432,
  username: env().database.user,
  password: env().database.password,
  database: env().database.name,
  synchronize: false,
  logging: env().application.nodeEnv !== 'development',
  entities: [
    join(__dirname, '..', '..', 'shared', 'entities', '*.entity.{ts,js}'),
  ],
  ssl:
    String(env().database.ssl).toLowerCase() === 'true'
      ? { rejectUnauthorized: false }
      : false,
  migrations: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'infra',
      'typeorm',
      'migrations',
      '*{.js,.ts}',
    ),
  ],
  subscribers: [
    join(__dirname, '..', '..', 'shared', 'subscribers', '*.{ts,js}'),
  ],
};

export const dataSource = new DataSource({ ...options });
