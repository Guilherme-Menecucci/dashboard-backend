import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as avatarsMiddleware from 'adorable-avatars';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/CatchExceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.use(
    cors({
      origin: process.env.APP_WEB_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use('/profile', avatarsMiddleware);

  await app.listen(3001);
}
bootstrap();
