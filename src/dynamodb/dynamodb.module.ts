import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DynamodbService } from './dynamodb.service';

@Module({
  imports: [ConfigModule],
  providers: [DynamodbService],
  exports: [DynamodbService],
})
export class DynamodbModule {}
