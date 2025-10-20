import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          const constraints = err.constraints
            ? Object.values(err.constraints).join(', ')
            : '';
          return `${err.property} - ${constraints}`;
        });

        if (messages.some((msg) => msg.includes('is required'))) {
          return new BadRequestException(
            'Invalid request body or missing "value" field',
          );
        }

        if (messages.some((msg) => msg.includes('must be a string'))) {
          return new UnprocessableEntityException(
            'Invalid data type for "value" (must be string)',
          );
        }

        return new BadRequestException('Invalid request body');
      },
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
