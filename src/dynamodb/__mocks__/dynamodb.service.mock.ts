export class DynamodbServiceMock {
  get: jest.Mock = jest.fn();
  scan: jest.Mock = jest.fn();
  query: jest.Mock = jest.fn();

  getDBClient() {
    return {
      get: this.dbClient_get,
      scan: this.dbClient_scan,
      // query: this.dbClient_query,
    };
  }

  dbClient_get = (
    payload: any,
    callback: (err: any, data: any) => void,
    forceError: boolean = false,
  ) => {
    if (forceError) {
      callback(new Error('test-error'), null);
      return;
    }
    const result = this.get(payload);
    callback(null, result);
  }

  dbClient_scan = (
    payload: any,
    callback: (err: any, data: any) => void,
    forceError: boolean = false,
  ) => {
    if (forceError) {
      callback(new Error('test-error'), null);
      return;
    }
    const result = this.scan(payload);
    callback(null, result);
  }
}