import { Test, TestingModule } from '@nestjs/testing';
import { ICategory, ICreatePostComment_Request, ICreatePostComment_Response, ICreatePost_Request, ICreatePost_Response, IGetCategory_Request, IGetCategory_Response, IGetPost_Request, IGetPost_Response, IListPosts_Request, IListPosts_Response, IPost, IPostComment, IPostReaction } from 'msforum-grpc';
import { ForumRepository } from '../forum.repository';
import { ForumService } from '../forum.service';

interface IMocks {
  category: ICategory;
  post: IPost;
  comment: IPostComment;

  posts: IPost[];
  subcategories: ICategory[];
  comments: IPostComment[];
  reactions: IPostReaction[];
}

const mocks: IMocks = {
  category: {
    id: 'test-category-id',
    parentId: 'test-category-parentId',
    createdAt: 'test-category-createdAt',
    postsCount: 0,
    title: 'test-category-title',
    description: 'test-category-description',
  },
  post: {
    id: 'test-post-id',
    categoryId: 'test-post-categoryId',
    createdBy: 'test-post-createdBy',
    commentsCount: 1,
    postState: 'open',
    postType: 'post',
    title: 'test-post-title',
    content: 'test-post-content',
    excerpt: 'test-post-excerpt',
    createdAt: 'test-post-createdAt',
    updatedAt: 'test-post-updatedAt',
  },
  comment: {
    id: 'test-comment-id',
    postId: 'test-comment-postId',
    parentId: 'test-comment-parentId',
    createdBy: 'test-comment-createdBy',
    content: 'test-comment-content',
    createdAt: 'test-comment-createdAt',
  },
  posts: [],
  subcategories: [],
  comments: [],
  reactions: [],
};

describe('ForumService', () => {
  let service: ForumService;
  let forumRepository: ForumRepository;

  beforeEach(async () => {
    forumRepository = {
      listMainCategories: jest.fn(),
      getCategoryById: jest.fn().mockReturnValue(mocks.category),
      listSubcategories: jest.fn().mockReturnValue(mocks.subcategories),
      listPostsByCategoryId: jest.fn().mockReturnValue(mocks.posts),
      getPostById: jest.fn().mockReturnValue(mocks.post),
      listPostComments: jest.fn().mockReturnValue(mocks.comments),
      createPost: jest.fn().mockReturnValue(mocks.post),
      createPostComment: jest.fn().mockReturnValue(mocks.comment),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumService, ForumRepository],
    })
      .overrideProvider(ForumRepository)
      .useValue(forumRepository)
      .compile();

    service = module.get<ForumService>(ForumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('listMainCategories', async () => {
    await service.listMainCategories();
    expect(forumRepository.listMainCategories).toHaveBeenCalledTimes(1);
  });

  it('getCategory', async () => {
    const payload: IGetCategory_Request = {
      categoryId: mocks.category.id,
    };
    const responseMock: IGetCategory_Response = {
      category: mocks.category,
      posts: mocks.posts,
      subcategories: mocks.subcategories,
    };
    const response: IGetCategory_Response = await service.getCategory(payload);

    expect(forumRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(forumRepository.listSubcategories).toHaveBeenCalledTimes(1);
    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledTimes(1);

    expect(forumRepository.getCategoryById).toHaveBeenCalledWith(payload.categoryId);
    expect(forumRepository.listSubcategories).toHaveBeenCalledWith(payload.categoryId);
    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledWith(payload.categoryId);

    expect(response).toStrictEqual(responseMock);
  });

  it('listPosts', async () => {
    const payload: IListPosts_Request = {
      categoryId: mocks.category.id,
    };
    const responseMock: IListPosts_Response = {
      posts: mocks.posts,
    };
    const response: IListPosts_Response = await service.listPosts(payload);
    
    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledTimes(1);

    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledWith(payload.categoryId);

    expect(response).toStrictEqual(responseMock);
  });

  it('getPost', async () => {
    const payload: IGetPost_Request = {
      postId: mocks.post.id,
    };
    const responseMock: IGetPost_Response = {
      post: mocks.post,
      category: mocks.category,
      comments: mocks.comments,
      reactions: mocks.reactions,
    };
    const response: IGetPost_Response = await service.getPost(payload);
    
    expect(forumRepository.getPostById).toHaveBeenCalledTimes(1);
    expect(forumRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(forumRepository.listPostComments).toHaveBeenCalledTimes(1);

    expect(forumRepository.getPostById).toHaveBeenCalledWith(responseMock.post.id);
    expect(forumRepository.getCategoryById).toHaveBeenCalledWith(responseMock.post.categoryId);
    expect(forumRepository.listPostComments).toHaveBeenCalledWith(responseMock.post.id);

    expect(response).toStrictEqual(responseMock);
  });

  it('createPost', async () => {
    const payload: ICreatePost_Request = mocks.post;
    const responseMock: ICreatePost_Response = mocks.post;
    const response: ICreatePost_Response = await service.createPost(payload);

    expect(forumRepository.createPost).toHaveBeenCalledTimes(1);

    expect(forumRepository.createPost).toHaveBeenCalledWith(payload);

    expect(response).toStrictEqual(responseMock);
  });

  it('createPostComment', async () => {
    const payload: ICreatePostComment_Request = mocks.comment;
    const responseMock: ICreatePostComment_Response = mocks.comment;
    const response: ICreatePostComment_Response = await service.createPostComment(payload);

    expect(forumRepository.createPostComment).toHaveBeenCalledTimes(1);

    expect(forumRepository.createPostComment).toHaveBeenCalledWith(payload);

    expect(response).toStrictEqual(responseMock);
  });
});
