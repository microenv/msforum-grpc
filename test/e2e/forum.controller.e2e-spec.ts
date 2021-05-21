import * as ProtoLoader from '@grpc/proto-loader';
import * as GRPC from 'grpc';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';
process.env = {...process.env, ...dotenv.parse(readFileSync(join(__dirname, '../../.env.test')))};
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { microserviceOptions } from 'src/grpc.options';
import { execSync } from 'child_process';
import { delayMs, requiredEnvs } from 'src/utils';
import { DynamodbServiceMock } from 'src/dynamodb/__mocks__/dynamodb.service.mock';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { TableName } from 'src/dynamodb/dynamodb.utils';
import { ICategory, IPost, IPostComment, IPostReaction } from 'msforum-grpc';

requiredEnvs(['NODE_ENV', 'GRPC_PORT', 'AWS_REGION']);

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

describe('ForumController (e2e)', () => {
  let app: INestApplication;
  let client: any;
  let dynamodbService: DynamodbServiceMock;
  const testPort = process.env.GRPC_PORT;

  beforeAll(async () => {
    dynamodbService = new DynamodbServiceMock();

    // Create Nest APP
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DynamodbService)
      .useValue(dynamodbService)
      .compile();
    app = module.createNestApplication();
    app.connectMicroservice(microserviceOptions);

    // Start gRPC microservice
    await app.startAllMicroservicesAsync();
    await app.init();

    // Load proto-buffers for test gRPC dispatch
    const packageDefinition = ProtoLoader.loadSync('msforum-grpc.proto', {
      includeDirs: [join(__dirname, '../')],
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }) as any;
    // Create Raw gRPC client object
    const protoDescriptor = GRPC.loadPackageDefinition(packageDefinition) as any;

    // Create client connected to started services at standard 5000 port
    client = new protoDescriptor.forum.ForumService(
      `localhost:${testPort}`,
      GRPC.credentials.createInsecure(),
    );
  });

  beforeEach(() => {
    dynamodbService.reset();
  });

  afterAll(() => {
    app.close();
  });

  it(`Port ${testPort} is open`, () => {
    expect(testPort).toBeDefined();
    const res = execSync(`nmap -p ${testPort} localhost`).toString();
    expect(res.indexOf(`${testPort}/tcp open`)).toBeGreaterThan(-1);
  });

  it('ping', (done) => {
    client.ping({}, (err, result) => {
      expect(err).toBeNull();
      expect(result).toStrictEqual({
        ping: 'pong',
      });
      done();
    });
  });

  it('listMainCategories', (done) => {
    dynamodbService.scan.mockReturnValue({ Items: mocks.categories });
    
    client.listMainCategories({}, (err, result) => {
      expect(err).toBeNull();
      expect(result.categories).toStrictEqual(mocks.categories);

      expect(dynamodbService.scan).toHaveBeenCalledTimes(1);

      expect(dynamodbService.scan).toHaveBeenCalledWith({
        TableName: TableName('categories'),
        FilterExpression:
          'attribute_not_exists(parentId) or parentId = :empty',
        ExpressionAttributeValues: {
          ':empty': null,
        },
      });
      
      done();
    });
  });
});
