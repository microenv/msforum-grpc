import { Module } from '@nestjs/common';
import { ForumModule } from './forum/forum.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [DynamodbModule, ForumModule],
})
export class AppModule {}
