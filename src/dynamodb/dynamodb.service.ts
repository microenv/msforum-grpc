import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Injectable } from '@nestjs/common';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummyAccessKeyId',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummySecretAccessKey',
  region: process.env.AWS_REGION,
  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  },
});

@Injectable()
export class DynamodbService {
  private dbClient: DocumentClient;

  constructor() {
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  getDBClient(): DocumentClient {
    return this.dbClient;
  }
}
