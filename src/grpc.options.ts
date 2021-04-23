import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const microserviceOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'forum',
    url: 'localhost:6000',
    protoPath: join(__dirname, '../msforum-grpc.proto'),
  },
};

export default microserviceOptions;
