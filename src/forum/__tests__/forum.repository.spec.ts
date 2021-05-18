import { Test, TestingModule } from "@nestjs/testing";
import { ICategory, IPost } from "msforum-grpc";
import { DynamodbService } from "src/dynamodb/dynamodb.service";
import { TableName } from "src/dynamodb/dynamodb.utils";
import { DynamodbServiceMock } from "src/dynamodb/__mocks__/dynamodb.service.mock";
import { ForumPolice } from "../forum.police";
import { ForumRepository } from "../forum.repository";

interface IMocks {
  post: IPost;
  category: ICategory;
  categories: ICategory[];
}

const mocks: IMocks = {
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
  category: {
    id: 'test-category-id',
    parentId: 'test-category-parentId',
    createdAt: 'test-category-createdAt',
    postsCount: 0,
    title: 'test-category-title',
    description: 'test-category-description',
  },
  categories: [],
};

describe('ForumRepository', () => {
  let repository: ForumRepository;
  let dynamodbService: DynamodbServiceMock;
  let forumPolice: ForumPolice;

  beforeEach(async () => {
    dynamodbService = new DynamodbServiceMock();
    
    forumPolice = {
      //
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumRepository, DynamodbService, ForumPolice],
    })
      .overrideProvider(DynamodbService)
      .useValue(dynamodbService)
      .overrideProvider(ForumPolice)
      .useValue(forumPolice)
      .compile();

    repository = module.get<ForumRepository>(ForumRepository);
  });

  it('getCategoryById', async () => {
    const categoryId = mocks.category.id;
    
    dynamodbService.get.mockReturnValue({ Item: mocks.category });
    
    expect(repository.getCategoryById(categoryId)).resolves.toStrictEqual(mocks.category);

    expect(dynamodbService.get).toHaveBeenCalledTimes(1);

    expect(dynamodbService.get).toHaveBeenCalledWith({
      TableName: TableName('categories'),
      Key: {
        id: categoryId,
      },
    });
  });

  it('getPostById', async () => {
    const postId = mocks.post.id;

    dynamodbService.get.mockReturnValue({ Item: mocks.post });

    expect(repository.getPostById(postId)).resolves.toStrictEqual(mocks.post);

    expect(dynamodbService.get).toHaveBeenCalledTimes(1);

    expect(dynamodbService.get).toHaveBeenCalledWith({
      TableName: TableName('posts'),
      Key: {
        id: postId,
      },
    });
  });

  it('listMainCategories', async () => {
    dynamodbService.scan.mockReturnValue({ Items: mocks.categories });

    expect(repository.listMainCategories()).resolves.toStrictEqual(mocks.categories);

    expect(dynamodbService.scan).toHaveBeenCalledTimes(1);

    expect(dynamodbService.scan).toHaveBeenCalledWith({
      TableName: TableName('categories'),
      FilterExpression:
        'attribute_not_exists(parentId) or parentId = :empty',
      ExpressionAttributeValues: {
        ':empty': null,
      },
    });
  });
});
