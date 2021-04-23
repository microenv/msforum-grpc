import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumRepository } from './forum.repository';
import { ForumPolice } from './forum.police';

@Module({
  imports: [],
  controllers: [ForumController],
  providers: [ForumService, ForumRepository, ForumPolice],
})
export class ForumModule {}
