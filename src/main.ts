import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import microserviceOptions from './grpc.options';
import { requiredEnvs } from './utils';

requiredEnvs(['NODE_ENV', 'AWS_REGION']);

const allowedEnvNames = ['local', 'production'];
if (!allowedEnvNames.includes(process.env.NODE_ENV)) {
  throw new Error(`Invalid NODE_ENV=${process.env.NODE_ENV}`);
}

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );

  app.listen(() => {
    logger.log(`[msforum-grpc@${process.env.NODE_ENV}] listening`);
  });
}
bootstrap();
