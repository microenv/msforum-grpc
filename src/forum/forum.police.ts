import { Injectable } from '@nestjs/common';
import { IPost } from 'msforum-grpc';

@Injectable()
export class ForumPolice {
  public sanitizePost({
    id,
    categoryId,
    title,
    excerpt,
    content,
    createdAt,
    createdBy,
    postState,
    postType,
    updatedAt,
    commentsCount,
  }: IPost): IPost {
    // @TODO ~ Validate

    return {
      id: String(id),
      categoryId: String(categoryId),
      title,
      excerpt,
      content,
      createdAt,
      createdBy: createdBy ? String(createdBy) : null,
      postState,
      postType,
      updatedAt,
      commentsCount,
    };
  }
}
