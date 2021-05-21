import { ConfigService } from '../config.service';

describe('ConfigService', () => {
  let configService;

  beforeAll(() => {
    configService = new ConfigService('.env.test');
  });

  it('should return an empty success response', async () => {
    expect(configService.get('NODE_ENV')).toEqual('test');
  });

  it('should have dynamodb set to localhost on test environment', async () => {
    expect(configService.get('DYNAMODB_TABLES_PREFIX')).toEqual('msforum_test');
    expect(configService.get('AWS_REGION')).toEqual('localhost');
    expect(configService.get('DYNAMODB_ENDPOINT')).toEqual(
      'http://msforum-dynamodb-test:8000',
    );
  });
});
