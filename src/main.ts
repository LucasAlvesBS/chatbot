import env from '@config/env';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { VERSIONS } from '@shared/constants';
import { Envs } from '@shared/enums/envs.enum';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');
  const port = env().application.apiPort;
  const globalPrefix = `api/v${VERSIONS.API}`;

  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Whatsapp POC')
    .setDescription('Integration with WhatApp API')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (env().application.nodeEnv === Envs.DEV) {
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  }

  await app.listen(port, () => logger.log(`API is running on port ${port}`));
}
bootstrap();
