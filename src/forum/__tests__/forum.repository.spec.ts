import { Test, TestingModule } from "@nestjs/testing";
import { ICategory, IPost, IPostComment } from "msforum-grpc";
import { DynamodbService } from "src/dynamodb/dynamodb.service";
import { TableName } from "src/dynamodb/dynamodb.utils";
import { DynamodbServiceMock } from "src/dynamodb/__mocks__/dynamodb.service.mock";
import { ForumPolice } from "../forum.police";
import { ForumRepository } from "../forum.repository";

interface IMocks {
  post: IPost;
  category: ICategory;
  posts: IPost[];
  categories: ICategory[];
  comments: IPostComment[];
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
  posts: [],
  categories: [],
  comments: [],
};

describe('ForumRepository', () => {
  let repository: ForumRepository;
  let dynamodbService: DynamodbServiceMock;
  let police: ForumPolice;

  beforeEach(async () => {
    dynamodbService = new DynamodbServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumRepository, DynamodbService, ForumPolice],
    })
      .overrideProvider(DynamodbService)
      .useValue(dynamodbService)
      .compile();

    repository = module.get<ForumRepository>(ForumRepository);
    police = module.get<ForumPolice>(ForumPolice);
  });

  it('getCategoryById', () => {
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

  it('getPostById', () => {
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

  it('listMainCategories', () => {
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

  it('listSubcategories', () => {
    const categoryId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.categories });

    expect(repository.listSubcategories(categoryId)).resolves.toStrictEqual(mocks.categories);

    expect(dynamodbService.query).toHaveBeenCalledTimes(1);

    expect(dynamodbService.query).toHaveBeenCalledWith({
      TableName: TableName('categories'),
      IndexName: 'WithParentId',
      KeyConditionExpression: 'parentId = :parentId',
      ExpressionAttributeValues: {
        ':parentId': categoryId,
      },
    });
  });

  it('listPostsByCategoryId', () => {
    const categoryId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.posts });

    expect(repository.listPostsByCategoryId(categoryId)).resolves.toStrictEqual(mocks.posts);

    expect(dynamodbService.query).toHaveBeenCalledTimes(1);

    expect(dynamodbService.query).toHaveBeenCalledWith({
      TableName: TableName('posts'),
      IndexName: 'WithCategoryId',
      KeyConditionExpression: 'categoryId = :categoryId',
      ExpressionAttributeValues: {
        ':categoryId': categoryId,
      },
    });
  });

  it('listPostComments', () => {
    const postId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.comments });

    expect(repository.listPostComments(postId)).resolves.toStrictEqual(mocks.comments);

    expect(dynamodbService.query).toHaveBeenCalledTimes(1);

    expect(dynamodbService.query).toHaveBeenCalledWith({
      TableName: TableName('comments'),
      IndexName: 'WithPostId',
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId,
      },
      Select: 'ALL_ATTRIBUTES',
    });
  });

  it('createPost', async () => {
    const response = await repository.createPost(mocks.post);

    expect(response.id).toBeDefined();
    expect(response.commentsCount).toStrictEqual(0);
    expect(typeof response.createdAt).toStrictEqual('string');
    expect(isNaN(new Date(response.createdAt).getTime())).toStrictEqual(false);
    expect(response.postType).toStrictEqual('post');
    expect(response.postState).toStrictEqual('open');
    expect(response.createdBy).toStrictEqual(mocks.post.createdBy);
    expect(response.title).toStrictEqual(mocks.post.title);
    expect(response.excerpt).toStrictEqual(mocks.post.excerpt);
    expect(response.content).toStrictEqual(mocks.post.content);
    expect(response.categoryId).toStrictEqual(mocks.post.categoryId);

    expect(dynamodbService.put).toHaveBeenCalledTimes(1);

    expect(dynamodbService.put).toHaveBeenCalledWith({
      TableName: TableName('posts'),
      Item: police.sanitizePost(response),
    });
  });

  it('updatePost', async () => {
    dynamodbService.get.mockReturnValue({ Item: mocks.post });

    const response = await repository.updatePost(mocks.post);

    expect(response).toStrictEqual(mocks.post);

    expect(dynamodbService.get).toHaveBeenCalledTimes(1);
    expect(dynamodbService.put).toHaveBeenCalledTimes(1);

    expect(dynamodbService.put).toHaveBeenCalledWith({
      TableName: TableName('posts'),
      Item: police.sanitizePost(response),
    });
  });
});
