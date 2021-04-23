/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ICategory, IGetCategory_Request, IGetCategory_Response, IPost, IPostType } from 'msforum-grpc';
import {
  ICreatePostComment_Request,
  ICreatePostComment_Response,
  ICreatePostReaction_Request,
  ICreatePostReaction_Response,
  ICreatePost_Request,
  ICreatePost_Response,
  IGetPost_Request,
  IGetPost_Response,
  IListMainCategories_Response,
  IListPosts_Request,
  IListPosts_Response,
  IUpdatePost_Request,
  IUpdatePost_Response,
} from 'msforum-grpc';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { TableName } from 'src/dynamodb/dynamodb.utils';
import { ForumRepository } from './forum.repository';

@Injectable()
export class ForumService {
  constructor(
    private readonly dynamodbService: DynamodbService,
    private readonly repository: ForumRepository,
  ) {}

  private dbClient(): DocumentClient {
    return this.dynamodbService.getDBClient();
  }

  async listMainCategories(): Promise<IListMainCategories_Response> {
    const categories = await this.repository.listMainCategories();

    return {
      categories,
    };
  }

  // async listCategories(
  //   payload: IListCategories_Request,
  // ): Promise<IListCategories_Response> {
  //   return {
  //     categories: await this.repository.listSubcategories(payload.parentId),
  //   };
  // }

  async getCategory(
    payload: IGetCategory_Request,
  ): Promise<IGetCategory_Response> {
    const category = await this.repository.getCategoryById(payload.categoryId);
    const subcategories = await this.repository.listSubcategories(String(category.id));
    const posts = await this.repository.listPostsByCategoryId(String(category.id));

    return await Promise.resolve({
      category,
      subcategories,
      posts,
    });
  }

  async listPosts(payload: IListPosts_Request): Promise<IListPosts_Response> {
    const posts = await this.repository.listPostsByCategoryId(String(payload.categoryId));
    
    return {
      posts,
    };
  }

  async getPost(
    payload: IGetPost_Request,
  ): Promise<IGetPost_Response> {
    const post = await this.repository.getPostById(String(payload.postId));
    const category = await this.repository.getCategoryById(String(post.categoryId));

    return await Promise.resolve({
      post,
      category,
      comments: [],
      reactions: [],
    });
  }

  async createPost(
    payload: ICreatePost_Request,
  ): Promise<ICreatePost_Response> {
    const {
      createdBy,
      title,
      excerpt,
      content,
      categoryId,
      // postState,
    } = payload;

    const post: IPost = {
      id: uuidv4(),
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      postType: 'post',
      postState: 'open',
      createdBy,
      title,
      excerpt,
      content,
      categoryId,
    };

    return await this.repository.createPost(post);
  }

  async createPostComment(
    payload: ICreatePostComment_Request,
  ): Promise<ICreatePostComment_Response> {
    return await Promise.resolve(null);
  }

  async createPostReaction(
    payload: ICreatePostReaction_Request,
  ): Promise<ICreatePostReaction_Response> {
    return await Promise.resolve(null);
  }

  async updatePost(
    payload: IUpdatePost_Request,
  ): Promise<IUpdatePost_Response> {
    return await Promise.resolve(null);
  }
}
