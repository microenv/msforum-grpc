import { Test, TestingModule } from "@nestjs/testing";
import { ICategory } from "msforum-grpc";
import { DynamodbService } from "src/dynamodb/dynamodb.service";
import { TableName } from "src/dynamodb/dynamodb.utils";
import { DynamodbServiceMock } from "src/dynamodb/__mocks__/dynamodb.service.mock";
import { ForumPolice } from "../forum.police";
import { ForumRepository } from "../forum.repository";

interface IMocks {
  category: ICategory;
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
});
