import { Test, TestingModule } from "@nestjs/testing";
import { DynamodbService } from "../dynamodb.service";

describe('DynamodbService', () => {
  let service: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamodbService],
    })
      .compile();

    service = module.get<DynamodbService>(DynamodbService);
  });

  it('getDBClient returns a DocumentClient', () => {
    expect(service.getDBClient()).toBeTruthy();
  });
});
