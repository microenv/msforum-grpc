import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Injectable } from '@nestjs/common';

const awsConfig: AWS.ConfigurationOptions = {
  region: 'us-east-1',
  // endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
  // accessKeyId: '',
  // secretAccessKey: '',
};
AWS.config.update(awsConfig);

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
