import { TableName } from '../dynamodb.utils';

describe('DynamodbUtils', () => {
  it('TableName should handle prefix underline', () => {
    const tableName = 'test';
    const prefix1 = 'prefix';
    const prefix2 = 'prefix_';
    const result = `${prefix2}${tableName}`;

    expect(TableName(tableName, prefix1)).toStrictEqual(result);
    expect(TableName(tableName, prefix2)).toStrictEqual(result);
  });
});
