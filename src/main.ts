import env from '@config/env';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(`API is running on port ${env().application.PORT}`);
}
bootstrap();
