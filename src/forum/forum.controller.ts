import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ForumService } from './forum.service';
import {
  ICreatePostComment_Request,
  ICreatePostComment_Response,
  ICreatePostReaction_Request,
  ICreatePostReaction_Response,
  ICreatePost_Request,
  ICreatePost_Response,
  IForumClient,
  IGetCategory_Request,
  IGetCategory_Response,
  IGetPost_Request,
  IGetPost_Response,
  IListMainCategories_Response,
  IListPosts_Request,
  IListPosts_Response,
  IUpdatePost_Request,
  IUpdatePost_Response,
} from 'msforum-grpc';

@Controller()
export class ForumController implements IForumClient {
  constructor(private readonly forumService: ForumService) {}

  @GrpcMethod('ForumService')
  public listMainCategories(): Promise<IListMainCategories_Response> {
    return this.forumService.listMainCategories();
  }

  // @GrpcMethod('ForumService')
  // public listCategories(
  //   @Payload() payload: IListCategories_Request,
  // ): Promise<IListMainCategories_Response> {
  //   return this.forumService.listCategories(payload);
  // }

  @GrpcMethod('ForumService')
  public getCategory(
    @Payload() payload: IGetCategory_Request,
  ): Promise<IGetCategory_Response> {
    return this.forumService.getCategory(payload);
  }

  @GrpcMethod('ForumService')
  public listPosts(
    @Payload() payload: IListPosts_Request,
  ): Promise<IListPosts_Response> {
    return this.forumService.listPosts(payload);
  }

  @GrpcMethod('ForumService')
  public getPost(
    @Payload() payload: IGetPost_Request,
  ): Promise<IGetPost_Response> {
    return this.forumService.getPost(payload);
  }

  @GrpcMethod('ForumService')
  public createPost(
    @Payload() payload: ICreatePost_Request,
  ): Promise<ICreatePost_Response> {
    return this.forumService.createPost(payload);
  }

  @GrpcMethod('ForumService')
  public createPostComment(
    @Payload() payload: ICreatePostComment_Request,
  ): Promise<ICreatePostComment_Response> {
    return this.forumService.createPostComment(payload);
  }

  @GrpcMethod('ForumService')
  public createPostReaction(
    @Payload() payload: ICreatePostReaction_Request,
  ): Promise<ICreatePostReaction_Response> {
    return this.forumService.createPostReaction(payload);
  }

  @GrpcMethod('ForumService')
  public updatePost(
    @Payload() payload: IUpdatePost_Request,
  ): Promise<IUpdatePost_Response> {
    return this.forumService.updatePost(payload);
  }
}
