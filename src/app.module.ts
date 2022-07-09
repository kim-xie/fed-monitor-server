import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';
import { EsModule } from './lib/elasticsearch/elasticsearch.module';
import { EsDemoModule } from './demo/es/es.module';

import { KafkaModule } from './common/kafka/kafka.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { TrackingController } from './tracking/tracking.controller';

import { AppService } from './app.service';

import TypeOrmConfig from './common/configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    KafkaModule.register({
      clientId: 'test-app-client',
      brokers: ['192.168.46.128:9092'],
      groupId: 'test-app-group',
    }),
    UsersModule,
    AuthModule,
    TrackingModule,
    EsModule,
    EsDemoModule,
  ],
  controllers: [AppController, UsersController, TrackingController],
  providers: [AppService, Logger],
})
export class AppModule {}
