import { Test, TestingModule } from '@nestjs/testing';
import { ICategory, IGetCategory_Request, IGetCategory_Response, IListPosts_Request, IListPosts_Response, IPost } from 'msforum-grpc';
import { ForumRepository } from '../forum.repository';
import { ForumService } from '../forum.service';

interface IMocks {
  category: ICategory;
  posts: IPost[];
  subcategories: ICategory[];
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
  posts: [],
  subcategories: [],
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
});
