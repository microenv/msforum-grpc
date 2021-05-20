import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ForumModule } from './forum/forum.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [
    ConfigModule,
    DynamodbModule,
    ForumModule,
  ],
})
export class AppModule {}
