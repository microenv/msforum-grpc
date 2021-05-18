export enum ERRLEVEL {
  none,
  all,
  get,
  scan,
  query,
  put,
}

export class DynamodbServiceMock {
  get: jest.Mock = jest.fn();
  scan: jest.Mock = jest.fn();
  query: jest.Mock = jest.fn();
  put: jest.Mock = jest.fn();
  error: Error = new Error('test-error');

  private _errorLevel: ERRLEVEL = ERRLEVEL.none;

  getDBClient() {
    return {
      get: this.dbClient_get,
      scan: this.dbClient_scan,
      query: this.dbClient_query,
      put: this.dbClient_put,
    };
  }

  setErrorLevel(errorLevel: ERRLEVEL) {
    this._errorLevel = errorLevel;
  }

  private shouldTriggerError = (currentLevel: ERRLEVEL) => {
    return this._errorLevel === ERRLEVEL.all || this._errorLevel === currentLevel;
  }

  private dbClient_get = (
    payload: any,
    callback: (err: any, data: any) => void,
  ) => {
    if (this.shouldTriggerError(ERRLEVEL.get)) {
      callback(this.error, null);
      return;
    }
    const result = this.get(payload);
    callback(null, result);
  }

  private dbClient_scan = (
    payload: any,
    callback: (err: any, data: any) => void,
  ) => {
    if (this.shouldTriggerError(ERRLEVEL.scan)) {
      callback(this.error, null);
      return;
    }
    const result = this.scan(payload);
    callback(null, result);
  }

  private dbClient_query = (
    payload: any,
    callback: (err: any, data: any) => void,
  ) => {
    if (this.shouldTriggerError(ERRLEVEL.query)) {
      callback(this.error, null);
      return;
    }
    const result = this.query(payload);
    callback(null, result);
  }

  private dbClient_put = (
    payload: any,
    callback: (err: any, data: any) => void,
  ) => {
    if (this.shouldTriggerError(ERRLEVEL.put)) {
      callback(this.error, null);
      return;
    }
    const result = this.put(payload);
    callback(null, result);
  }
}
