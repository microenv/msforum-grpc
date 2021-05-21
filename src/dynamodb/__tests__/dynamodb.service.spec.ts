import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { DynamodbService } from '../dynamodb.service';

describe('DynamodbService', () => {
  let service: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [DynamodbService],
    })
      .overrideProvider(ConfigService)
      .useValue(new ConfigService('.env.test'))
      .compile();

    service = module.get<DynamodbService>(DynamodbService);
  });

  it('getDBClient returns a DocumentClient', () => {
    expect(service.getDBClient()).toBeTruthy();
  });
});
