import { Injectable } from '@nestjs/common';
import { IPost, IPostComment } from 'msforum-grpc';

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
      createdBy: createdBy || null,
      postState,
      postType,
      updatedAt,
      commentsCount,
    };
  }

  public sanitizePostComment({
    id,
    postId,
    parentId,
    createdBy,
    content,
    createdAt,
  }: IPostComment): IPostComment {
    return {
      id,
      postId,
      parentId,
      createdBy: createdBy || null,
      content,
      createdAt,
    }
  }
}
