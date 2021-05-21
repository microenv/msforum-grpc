import { Test, TestingModule } from '@nestjs/testing';
import {
  ICreatePostComment_Request,
  ICreatePostReaction_Request,
  ICreatePost_Request,
  IGetCategory_Request,
  IGetPost_Request,
  IListPosts_Request,
  IUpdatePost_Request,
} from 'msforum-grpc';
import { ForumController } from '../forum.controller';
import { ForumService } from '../forum.service';

const mocks = {
  mainCategories: [],
};

describe('ForumController', () => {
  let controller: ForumController;
  let forumService;

  beforeEach(async () => {
    forumService = {
      listMainCategories: jest.fn().mockResolvedValue(mocks.mainCategories),
      getCategory: jest.fn(async (payload) => payload),
      listPosts: jest.fn(async (payload) => payload),
      getPost: jest.fn(async (payload) => payload),
      createPost: jest.fn(async (payload) => payload),
      createPostComment: jest.fn(async (payload) => payload),
      createPostReaction: jest.fn(async (payload) => payload),
      updatePost: jest.fn(async (payload) => payload),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumController],
      providers: [ForumService],
    })
      .overrideProvider(ForumService)
      .useValue(forumService)
      .compile();

    controller = module.get<ForumController>(ForumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listMainCategories', () => {
    expect(controller.listMainCategories()).resolves.toStrictEqual(
      mocks.mainCategories,
    );
    expect(forumService.listMainCategories).toHaveBeenCalledTimes(1);
  });

  it('getCategory', () => {
    const payload: IGetCategory_Request = {
      categoryId: 'test',
    };
    expect(controller.getCategory(payload)).resolves.toStrictEqual(payload);
    expect(forumService.getCategory).toHaveBeenCalledTimes(1);
  });

  it('listPosts', () => {
    const payload: IListPosts_Request = {
      categoryId: 'test',
    };
    expect(controller.listPosts(payload)).resolves.toStrictEqual(payload);
    expect(forumService.listPosts).toHaveBeenCalledTimes(1);
  });

  it('getPost', () => {
    const payload: IGetPost_Request = {
      postId: 'test',
    };
    expect(controller.getPost(payload)).resolves.toStrictEqual(payload);
    expect(forumService.getPost).toHaveBeenCalledTimes(1);
  });

  it('createPost', () => {
    const payload: ICreatePost_Request = {
      categoryId: 'test-categoryId',
      createdBy: 'test-createdBy',
      content: 'test-content',
      excerpt: 'test-excerpt',
      title: 'test-title',
    };
    expect(controller.createPost(payload)).resolves.toStrictEqual(payload);
    expect(forumService.createPost).toHaveBeenCalledTimes(1);
  });

  it('createPostComment', () => {
    const payload: ICreatePostComment_Request = {
      postId: 'test-postId',
      parentId: 'test-parentId',
      createdBy: 'test-createdBy',
      content: 'test-content',
    };
    expect(controller.createPostComment(payload)).resolves.toStrictEqual(
      payload,
    );
    expect(forumService.createPostComment).toHaveBeenCalledTimes(1);
  });

  it('createPostReaction', () => {
    const payload: ICreatePostReaction_Request = {
      postId: 'test-postId',
      commentId: 'test-commentId',
      createdBy: 'test-createdBy',
      reactType: 'test-reactType',
    };
    expect(controller.createPostReaction(payload)).resolves.toStrictEqual(
      payload,
    );
    expect(forumService.createPostReaction).toHaveBeenCalledTimes(1);
  });

  it('updatePost', () => {
    const payload: IUpdatePost_Request = {
      id: 'test-id',
      createdBy: 'test-createdBy',
      content: 'test-content',
      excerpt: 'test-excerpt',
      postState: 'open',
      postType: 'post',
      title: 'test-title',
    };
    expect(controller.updatePost(payload)).resolves.toStrictEqual(payload);
    expect(forumService.updatePost).toHaveBeenCalledTimes(1);
  });
});
