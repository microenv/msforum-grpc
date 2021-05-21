import { Test, TestingModule } from '@nestjs/testing';
import { ICategory, IPost, IPostComment, IPostReaction } from 'msforum-grpc';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { TableName } from 'src/dynamodb/dynamodb.utils';
import {
  DynamodbServiceMock,
  ERRLEVEL,
} from 'src/dynamodb/__mocks__/dynamodb.service.mock';
import { ForumPolice } from '../forum.police';
import { ForumRepository } from '../forum.repository';

interface IMocks {
  post: IPost;
  category: ICategory;
  comment: IPostComment;
  reaction: IPostReaction;
  posts: IPost[];
  categories: ICategory[];
  comments: IPostComment[];
}

const mocks: IMocks = {
  post: {
    id: 'test-post-id',
    categoryId: 'test-post-categoryId',
    createdBy: null,
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
  comment: {
    id: 'test-comment-id',
    postId: 'test-comment-postId',
    parentId: 'test-comment-parentId',
    createdBy: null,
    content: 'test-comment-content',
    createdAt: 'test-comment-createdAt',
  },
  reaction: {
    id: 'test-reaction-id',
    postId: 'test-reaction-postId',
    commentId: 'test-reaction-commentId',
    reactType: 'test-reaction-reactType',
    createdAt: 'test-reaction-createdAt',
    createdBy: 'test-reaction-createdBy',
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

    expect(repository.getCategoryById(categoryId)).resolves.toStrictEqual(
      mocks.category,
    );

    expect(dynamodbService.get).toHaveBeenCalledTimes(1);

    expect(dynamodbService.get).toHaveBeenCalledWith({
      TableName: TableName('categories'),
      Key: {
        id: categoryId,
      },
    });
  });

  it('getCategoryById with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.getCategoryById(mocks.category.id)).rejects.toEqual(
      dynamodbService.error,
    );
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

  it('getPostById with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.getPostById(mocks.category.id)).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('listMainCategories', () => {
    dynamodbService.scan.mockReturnValue({ Items: mocks.categories });

    expect(repository.listMainCategories()).resolves.toStrictEqual(
      mocks.categories,
    );

    expect(dynamodbService.scan).toHaveBeenCalledTimes(1);

    expect(dynamodbService.scan).toHaveBeenCalledWith({
      TableName: TableName('categories'),
      FilterExpression: 'attribute_not_exists(parentId) or parentId = :empty',
      ExpressionAttributeValues: {
        ':empty': null,
      },
    });
  });

  it('listMainCategories with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.listMainCategories()).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('listSubcategories', () => {
    const categoryId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.categories });

    expect(repository.listSubcategories(categoryId)).resolves.toStrictEqual(
      mocks.categories,
    );

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

  it('listSubcategories with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.listSubcategories(mocks.category.id)).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('listPostsByCategoryId', () => {
    const categoryId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.posts });

    expect(repository.listPostsByCategoryId(categoryId)).resolves.toStrictEqual(
      mocks.posts,
    );

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

  it('listPostsByCategoryId with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.listPostsByCategoryId(mocks.category.id)).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('listPostComments', () => {
    const postId = mocks.category.id;

    dynamodbService.query.mockReturnValue({ Items: mocks.comments });

    expect(repository.listPostComments(postId)).resolves.toStrictEqual(
      mocks.comments,
    );

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

  it('listPostComments with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.listPostComments(mocks.post.id)).rejects.toEqual(
      dynamodbService.error,
    );
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

  it('createPost with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.createPost(mocks.post)).rejects.toEqual(
      dynamodbService.error,
    );
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

  it('updatePost with error', () => {
    dynamodbService.get.mockReturnValue({ Item: mocks.post });

    dynamodbService.setErrorLevel(ERRLEVEL.put);
    expect(repository.updatePost(mocks.post)).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('updatePost with invalid author', () => {
    dynamodbService.get.mockReturnValue({ Item: mocks.post });

    dynamodbService.setErrorLevel(ERRLEVEL.put);
    const invalidPost = { ...mocks.post, createdBy: 'invalid-author' };
    const error = new Error(`Invalid author`);
    expect(repository.updatePost(invalidPost)).rejects.toEqual(error);
  });

  it('createPostComment', async () => {
    const response = await repository.createPostComment(mocks.comment);

    expect(response.id).toBeDefined();
    expect(typeof response.createdAt).toStrictEqual('string');
    expect(isNaN(new Date(response.createdAt).getTime())).toStrictEqual(false);
    expect(response.postId).toStrictEqual(mocks.comment.postId);
    expect(response.parentId).toStrictEqual(mocks.comment.parentId);
    expect(response.createdBy).toStrictEqual(mocks.comment.createdBy);
    expect(response.content).toStrictEqual(mocks.comment.content);

    expect(dynamodbService.put).toHaveBeenCalledTimes(1);

    expect(dynamodbService.put).toHaveBeenCalledWith({
      TableName: TableName('comments'),
      Item: police.sanitizePostComment(response),
    });
  });

  it('createPostComment with error', () => {
    dynamodbService.setErrorLevel(ERRLEVEL.all);
    expect(repository.createPostComment(mocks.comment)).rejects.toEqual(
      dynamodbService.error,
    );
  });

  it('createPostReaction', async () => {
    const response = await repository.createPostReaction(mocks.reaction);

    expect(response.id).toBeDefined();
    expect(typeof response.createdAt).toStrictEqual('string');
    expect(isNaN(new Date(response.createdAt).getTime())).toStrictEqual(false);
    expect(response.postId).toStrictEqual(mocks.reaction.postId);
    expect(response.commentId).toStrictEqual(mocks.reaction.commentId);
    expect(response.reactType).toStrictEqual(mocks.reaction.reactType);
    expect(response.createdBy).toStrictEqual(mocks.reaction.createdBy);
    expect(response.createdAt).toBeDefined();

    expect(dynamodbService.put).toHaveBeenCalledTimes(1);

    expect(dynamodbService.put).toHaveBeenCalledWith({
      TableName: TableName('reactions'),
      Item: police.sanitizePostReaction(response),
    });
  });
});
