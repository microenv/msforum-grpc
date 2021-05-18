import { Test, TestingModule } from '@nestjs/testing';
import { IGetCategory_Request, IGetCategory_Response } from 'msforum-grpc';
import { ForumRepository } from '../forum.repository';
import { ForumService } from '../forum.service';

interface IMocks {
  getCategoryResponse: IGetCategory_Response;
}

const mocks: IMocks = {
  getCategoryResponse: {
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
  },
};

describe('ForumService', () => {
  let service: ForumService;
  let forumRepository: ForumRepository;

  beforeEach(async () => {
    forumRepository = {
      listMainCategories: jest.fn(),
      getCategoryById: jest.fn().mockReturnValue(mocks.getCategoryResponse.category),
      listSubcategories: jest.fn().mockReturnValue(mocks.getCategoryResponse.subcategories),
      listPostsByCategoryId: jest.fn().mockReturnValue(mocks.getCategoryResponse.posts),
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
      categoryId: mocks.getCategoryResponse.category.id,
    };
    const response: IGetCategory_Response = await service.getCategory(payload);

    expect(forumRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(forumRepository.listSubcategories).toHaveBeenCalledTimes(1);
    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledTimes(1);

    expect(forumRepository.getCategoryById).toHaveBeenCalledWith(payload.categoryId);
    expect(forumRepository.listSubcategories).toHaveBeenCalledWith(payload.categoryId);
    expect(forumRepository.listPostsByCategoryId).toHaveBeenCalledWith(payload.categoryId);

    expect(response).toEqual(mocks.getCategoryResponse);
  });
});
