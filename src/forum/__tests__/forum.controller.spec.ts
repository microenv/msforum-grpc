import { Test, TestingModule } from '@nestjs/testing';
import { ICreatePostComment_Request, ICreatePostReaction_Request, ICreatePost_Request, IGetCategory_Request, IGetPost_Request, IListPosts_Request, IUpdatePost_Request } from 'msforum-grpc';
import { ForumController } from '../forum.controller';
import { ForumService } from '../forum.service';

const mocks = {
  mainCategories: [],
};

const forumService = {
  listMainCategories: () => mocks.mainCategories,
  getCategory: (payload) => payload,
  listPosts: (payload) => payload,
  getPost: (payload) => payload,
  createPost: (payload) => payload,
  createPostComment: (payload) => payload,
  createPostReaction: (payload) => payload,
  updatePost: (payload) => payload,
};

describe('ForumController', () => {
  let controller: ForumController;

  beforeEach(async () => {
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

  it('listMainCategories', async () => {
    expect(await controller.listMainCategories()).toEqual(mocks.mainCategories);
  });

  it('getCategory', async () => {
    const payload: IGetCategory_Request = {
      categoryId: 'test',
    };
    expect(await controller.getCategory(payload)).toStrictEqual(payload);
  });

  it('listPosts', async () => {
    const payload: IListPosts_Request = {
      categoryId: 'test',
    };
    expect(await controller.listPosts(payload)).toStrictEqual(payload);
  });

  it('getPost', async () => {
    const payload: IGetPost_Request = {
      postId: 'test',
    };
    expect(await controller.getPost(payload)).toStrictEqual(payload);
  });

  it('createPost', async () => {
    const payload: ICreatePost_Request = {
      categoryId: 'test-categoryId',
      createdBy: 'test-createdBy',
      content: 'test-content',
      excerpt: 'test-excerpt',
      title: 'test-title',
    };
    expect(await controller.createPost(payload)).toStrictEqual(payload);
  });

  it('createPostComment', async () => {
    const payload: ICreatePostComment_Request = {
      postId: 'test-postId',
      parentId: 'test-parentId',
      createdBy: 'test-createdBy',
      content: 'test-content',
    };
    expect(await controller.createPostComment(payload)).toStrictEqual(payload);
  });

  it('createPostReaction', async () => {
    const payload: ICreatePostReaction_Request = {
      postId: 'test-postId',
      commentId: 'test-commentId',
      createdBy: 'test-createdBy',
      reactType: 'test-reactType',
    };
    expect(await controller.createPostReaction(payload)).toStrictEqual(payload);
  });

  it('updatePost', async () => {
    const payload: IUpdatePost_Request = {
      id: 'test-id',
      createdBy: 'test-createdBy',
      content: 'test-content',
      excerpt: 'test-excerpt',
      postState: 'open',
      postType: 'post',
      title: 'test-title',
    };
    expect(await controller.updatePost(payload)).toStrictEqual(payload);
  });
});
