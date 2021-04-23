import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import microserviceOptions from './grpc.options';

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
