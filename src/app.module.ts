import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';
import { EsModule } from './lib/elasticsearch/elasticsearch.module';
import { EsDemoModule } from './demo/es/es.module';
import { KafkaModule } from './demo/kafka/kafka.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { TrackingController } from './tracking/tracking.controller';
import { KafkaController } from './demo/kafka/kafka.controller';

import { AppService } from './app.service';
// import { KafkaService } from './demo/kafka/kafka.service';

import TypeOrmConfig from './common/configs/typeorm.config';
// import MicroserviceConfig from './common/configs/microservice.config';

// import { LoggerMiddleware } from './common/middlewares/logger-middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ClientsModule.register([
      {
        name: 'fed-monitor-kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'kafka',
            brokers: ['localhost:9091', 'localhost:9092'],
            // brokers: ['49.234.134.123:2181'],
          },
          consumer: {
            groupId: 'kafka-consumer',
          },
        },
      },
    ]),
    UsersModule,
    AuthModule,
    TrackingModule,
    EsModule,
    EsDemoModule,
    KafkaModule,
  ],
  controllers: [
    AppController,
    UsersController,
    TrackingController,
    KafkaController,
  ],
  providers: [AppService, Logger],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
