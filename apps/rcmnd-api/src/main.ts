/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import bodyParser from 'body-parser';
import { ApiResponseInterceptor } from '@blavoss-cswdi/backend/dto';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions: CorsOptions = {};
  app.enableCors(corsOptions);

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const port = process.env.PORT || 3100;
  await app.listen(port);
  Logger.log(
    `🚀 rcmnd-api Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
