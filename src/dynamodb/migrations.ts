import * as AWS from 'aws-sdk';
import { ConfigService } from 'src/config/config.service';
import { DynamodbService } from './dynamodb.service';
import { TableName } from './dynamodb.utils';

const configService = new ConfigService('.env');
const dynamodbService = new DynamodbService(configService);
const dynamoDB: AWS.DynamoDB = dynamodbService.getDynamoDB();

async function run() {
	// eslint-disable-next-line
	console.log('');
	await tableCategories();
	await tablePosts();
	await tableComments();
	await tableReactions();
	// eslint-disable-next-line
	console.log('');
}
run();

function logTableCreated(tableName) {
	// eslint-disable-next-line
	console.log(`Table created: ${tableName}`);
}

function logTableError(tableName, err) {
	// eslint-disable-next-line
	console.log(`Error: ${tableName} - ${err.message.split('\n').shift()}`)
}

function tableCategories() {
	return new Promise((resolve) => {
		const tableName = TableName('categories');

		const params = {
			TableName: tableName,
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
						ProjectionType: "INCLUDE",
						NonKeyAttributes: [ "title" ],
					},
					ProvisionedThroughput: { 
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			],
		};

		dynamoDB
			.createTable(params)
			.promise()
			.then(() => {
				logTableCreated(tableName);
				resolve(true);
			}).catch((err) => {
				logTableError(tableName, err);
				resolve(false);
			});
	});
}

function tablePosts() {
	return new Promise((resolve) => {
		const tableName = TableName('posts');

		const params = {
			TableName: tableName,
			AttributeDefinitions: [
				{ AttributeName: 'id', AttributeType: 'S' },
				{ AttributeName: 'categoryId', AttributeType: 'S' },
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
					IndexName: "WithCategoryId",
					KeySchema: [ 
						{ AttributeName: "categoryId", KeyType: "HASH" },
						{ AttributeName: "createdAt", KeyType: "RANGE" },
					],
					Projection: { 
						ProjectionType: "INCLUDE",
						NonKeyAttributes: [ "title", "createdAt" ],
					},
					ProvisionedThroughput: { 
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			],
		};

		dynamoDB
			.createTable(params)
			.promise()
			.then(() => {
				logTableCreated(tableName);
				resolve(true);
			}).catch((err) => {
				logTableError(tableName, err);
				resolve(false);
			});
	});
}

function tableComments() {
	return new Promise((resolve) => {
		const tableName = TableName('comments');

		const params = {
			TableName: tableName,
			AttributeDefinitions: [
				{ AttributeName: 'id', AttributeType: 'S' },
				{ AttributeName: 'postId', AttributeType: 'S' },
				{ AttributeName: 'createdAt', AttributeType: 'S' },
			],
			KeySchema: [
				{ AttributeName: 'id', KeyType: 'HASH' },
				{ AttributeName: "createdAt", KeyType: "RANGE" },
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1,
			},
			GlobalSecondaryIndexes: [ 
				{ 
					IndexName: "WithPostId",
					KeySchema: [ 
						{ AttributeName: "postId", KeyType: "HASH" },
						{ AttributeName: "createdAt", KeyType: "RANGE" },
					],
					Projection: { 
						ProjectionType: "ALL"
					},
					ProvisionedThroughput: { 
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			],
		};

		dynamoDB
			.createTable(params)
			.promise()
			.then(() => {
				logTableCreated(tableName);
				resolve(true);
			}).catch((err) => {
				logTableError(tableName, err);
				resolve(false);
			});
	});
}


function tableReactions() {
	return new Promise((resolve) => {
		const tableName = TableName('reactions');

		const params = {
			TableName: tableName,
			AttributeDefinitions: [
				{ AttributeName: 'id', AttributeType: 'S' },
				{ AttributeName: 'postId', AttributeType: 'S' },
				{ AttributeName: 'commentId', AttributeType: 'S' },
				{ AttributeName: 'createdAt', AttributeType: 'S' },
			],
			KeySchema: [
				{ AttributeName: 'id', KeyType: 'HASH' },
				{ AttributeName: "createdAt", KeyType: "RANGE" },
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1,
			},
			GlobalSecondaryIndexes: [ 
				{ 
					IndexName: "WithPostId",
					KeySchema: [ 
						{ AttributeName: "postId", KeyType: "HASH" },
						{ AttributeName: "createdAt", KeyType: "RANGE" },
					],
					Projection: { 
						ProjectionType: "ALL",
					},
					ProvisionedThroughput: { 
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					}
				},
				{ 
					IndexName: "WithCommentId",
					KeySchema: [ 
						{ AttributeName: "commentId", KeyType: "HASH" },
						{ AttributeName: "createdAt", KeyType: "RANGE" },
					],
					Projection: { 
						ProjectionType: "ALL",
					},
					ProvisionedThroughput: { 
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			],
		};

		dynamoDB
			.createTable(params)
			.promise()
			.then(() => {
				logTableCreated(tableName);
				resolve(true);
			}).catch((err) => {
				logTableError(tableName, err);
				resolve(false);
			});
	});
}
