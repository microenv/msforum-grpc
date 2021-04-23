import { Injectable } from '@nestjs/common';
import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ICategory, IPost } from 'msforum-grpc';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { TableName } from 'src/dynamodb/dynamodb.utils';
import { ForumPolice } from './forum.police';

@Injectable()
export class ForumRepository {
  constructor(
    private readonly dynamodbService: DynamodbService,
    private readonly police: ForumPolice,
  ) {}

  private dbClient(): DocumentClient {
    return this.dynamodbService.getDBClient();
  }

  getCategoryById(categoryId: string): Promise<ICategory> {
    return new Promise((resolve, reject) => {
      this.dbClient().get(
        {
          TableName: TableName('categories'),
          Key: {
            id: String(categoryId),
          },
        },
        (err: AWSError, data: DocumentClient.GetItemOutput) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data.Item as ICategory);
        },
      );
    });
  }

  getPostById(postId: string): Promise<IPost> {
    return new Promise((resolve, reject) => {
      console.log('------------------------ 1');
      this.dbClient().get(
        {
          TableName: TableName('posts'),
          Key: {
            id: postId,
          },
        },
        (err: AWSError, data: DocumentClient.GetItemOutput) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data.Item as IPost);
        },
      );
    });
  }

  // Aws SDK docs
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
  listMainCategories(): Promise<ICategory[]> {
    return new Promise((resolve, reject) => {
      // Query operators on Dynamodb
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html
      this.dbClient().scan(
        {
          TableName: TableName('categories'),
          FilterExpression:
            'attribute_not_exists(parentId) or parentId = :empty',
          ExpressionAttributeValues: {
            ':empty': null,
          },
        },
        (err: AWSError, data: DocumentClient.QueryOutput) => {
          if (err) {
            reject(err);
            return;
          }
          /***********************************
           * data:
           * {
           *   Items: [{id: '1', title: 'Category 1',...}],
           *   Count: 1,
           *   ScannedCount: 1
           * }
           */
          resolve(data.Items as ICategory[]);
        },
      );
    });
  }

  listSubcategories(categoryId: string): Promise<ICategory[]> {
    return new Promise((resolve, reject) => {
      this.dbClient().query(
        {
          TableName: TableName('categories'),
          IndexName: 'WithParentId',
          KeyConditionExpression: 'parentId = :parentId',
          ExpressionAttributeValues: {
            ':parentId': categoryId && String(categoryId),
          },
        },
        (err: AWSError, data: DocumentClient.QueryOutput) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data.Items as ICategory[]);
        },
      );
    });
  }

  listPostsByCategoryId(categoryId: string): Promise<IPost[]> {
    return new Promise((resolve, reject) => {
      this.dbClient().query(
        {
          TableName: TableName('posts'),
          IndexName: 'WithCategoryId',
          KeyConditionExpression: 'categoryId = :categoryId',
          ExpressionAttributeValues: {
            ':categoryId': categoryId && String(categoryId),
          },
        },
        (err: AWSError, data: DocumentClient.QueryOutput) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data.Items as IPost[]);
        },
      );
    });
  }

  createPost(post: IPost): Promise<IPost> {
    return new Promise((resolve, reject) => {
      this.dbClient().put(
        {
          TableName: TableName('posts'),
          Item: this.police.sanitizePost(post),
        },
        (err: AWSError) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(post);
        },
      );
    });
  }
}
