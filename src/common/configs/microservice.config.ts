import { KafkaOptions, Transport } from '@nestjs/microservices';

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'hero',
      // brokers: ['localhost:9092'],
      brokers: ['49.234.134.123:2181'],
    },
    consumer: {
      groupId: 'hero-consumer',
    },
  },
};

export default microserviceConfig;
