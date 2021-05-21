import * as dotenv from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';
process.env = {...process.env, ...dotenv.parse(readFileSync(join(__dirname, '../../.env')))};
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { TableName } from 'src/dynamodb/dynamodb.utils';
import { ConfigService } from 'src/config/config.service';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { requiredEnvs } from 'src/utils';

requiredEnvs(['NODE_ENV', 'GRPC_PORT', 'AWS_REGION']);

describe(`Test Dynamodb on ${process.env.DYNAMODB_ENDPOINT}`, () => {
  let configService: ConfigService;
  let dynamodbService: DynamodbService;
  let db: AWS.DynamoDB;
  let dbClient: DocumentClient;

  beforeAll(async () => {
    configService = new ConfigService(join(__dirname, '../../.env.test'));
    dynamodbService = new DynamodbService(configService);
    db = dynamodbService.getDynamoDB();
    dbClient = dynamodbService.getDBClient();
  });

  it(`List tables`, (done) => {
    db.listTables((err: AWS.AWSError, data: AWS.DynamoDB.ListTablesOutput) => {
      expect(err).toBeNull();
      expect(data.TableNames).toContain(TableName('categories'));
      expect(data.TableNames).toContain(TableName('posts'));
      expect(data.TableNames).toContain(TableName('comments'));
      expect(data.TableNames).toContain(TableName('reactions'));
      done();
    });
  });
});
