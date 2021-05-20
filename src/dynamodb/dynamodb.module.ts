import { Global, Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DynamodbService } from './dynamodb.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DynamodbService],
  exports: [DynamodbService],
})
export class DynamodbModule {}
