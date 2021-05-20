import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcPort = process.env.GRPC_PORT;

export const microserviceOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${grpcPort}`,
    package: 'forum',
    protoPath: join(__dirname, '../msforum-grpc.proto'),
  },
};
