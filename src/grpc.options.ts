import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const microserviceOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'forum',
    url: '0.0.0.0:3000',
    protoPath: join(__dirname, '../msforum-grpc.proto'),
  },
};

console.log('microserviceOptions: ', microserviceOptions);

export default microserviceOptions;
