import * as ProtoLoader from '@grpc/proto-loader';
import * as GRPC from 'grpc';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';
process.env = {...process.env, ...dotenv.parse(readFileSync(join(__dirname, '../.env.test')))};
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { microserviceOptions } from 'src/grpc.options';
import { execSync } from 'child_process';
import { delayMs, requiredEnvs } from 'src/utils';

requiredEnvs(['NODE_ENV', 'GRPC_PORT', 'AWS_REGION']);

describe('ForumController (e2e)', () => {
  let app: INestApplication;
  let client: any;
  const testPort = process.env.GRPC_PORT;

  beforeAll(async () => {
    // Create Nest APP
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.connectMicroservice(microserviceOptions);

    // Start gRPC microservice
    await app.startAllMicroservicesAsync();
    await app.init();

    // Load proto-buffers for test gRPC dispatch
    const packageDefinition = ProtoLoader.loadSync('msforum-grpc.proto', {
      includeDirs: [join(__dirname, '../')],
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }) as any;
    // Create Raw gRPC client object
    const protoDescriptor = GRPC.loadPackageDefinition(packageDefinition) as any;

    // Create client connected to started services at standard 5000 port
    client = new protoDescriptor.forum.ForumService(
      `localhost:${testPort}`,
      GRPC.credentials.createInsecure(),
    );
  });

  afterAll(() => {
    app.close();
  });

  it(`Port ${testPort} is open`, () => {
    expect(testPort).toBeDefined();
    const res = execSync(`nmap -p ${testPort} localhost`).toString();
    expect(res.indexOf('30560/tcp open')).toBeGreaterThan(-1);
  });

  it('ping', (done) => {
    client.ping({}, (err, result) => {
      expect(err).toBeNull();
      expect(result).toStrictEqual({
        ping: 'pong',
      });
      done();
    });
  });
});
