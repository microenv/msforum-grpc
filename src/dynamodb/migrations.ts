import * as AWS from 'aws-sdk';
import { ConfigService } from 'src/config/config.service';
import { DynamodbService } from './dynamodb.service';
import { TableName } from './dynamodb.utils';

const configService = new ConfigService('.env');
const dynamodbService = new DynamodbService(configService);
// const dynamoDB = dynamodbService.getDBClient();
const dynamoDB = new AWS.DynamoDB();

const params = {
	TableName: TableName('categories'),
	AttributeDefinitions: [
		{ AttributeName: 'id', AttributeType: 'S' },
		{ AttributeName: 'parentId', AttributeType: 'S' },
		{ AttributeName: 'createdAt', AttributeType: 'S' },
	],
	KeySchema: [
		{ AttributeName: 'id', KeyType: 'HASH' },
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1,
	},
	GlobalSecondaryIndexes: [ 
		{ 
			IndexName: "WithParentId",
			KeySchema: [ 
				{ AttributeName: "parentId", KeyType: "HASH" },
				{ AttributeName: "createdAt", KeyType: "RANGE" },
			],
			Projection: { 
				NonKeyAttributes: [ "title" ],
				ProjectionType: "INCLUDE"
			},
			ProvisionedThroughput: { 
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1,
			}
		}
 ],
};

try {
	dynamoDB
		.createTable(params)
		.promise()
		.then(() => {
			//eslint-disable-next-line
			console.log('Succesfully created!');
		});
} catch (err) {
	// eslint-disable-next-line
	console.log('(IGNORE) Error while creating table', err);
}
