import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DynamodbService {
  private dbClient: DocumentClient;
  private dynamoDB: AWS.DynamoDB;

  constructor(configService: ConfigService) {
    AWS.config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID') || 'dummyAccessKeyId',
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY') || 'dummySecretAccessKey',
      region: configService.get('AWS_REGION'),
      dynamodb: {
        endpoint: configService.get('DYNAMODB_ENDPOINT') || undefined,
      },
    });

    this.dbClient = new AWS.DynamoDB.DocumentClient();
    this.dynamoDB = new AWS.DynamoDB();
  }

  getDBClient(): DocumentClient {
    return this.dbClient;
  }

  getDynamoDB(): AWS.DynamoDB {
    return this.dynamoDB;
  }
}
