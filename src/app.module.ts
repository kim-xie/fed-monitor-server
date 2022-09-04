import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';
import { EsModule } from './lib/es/es.module';
import { EsDemoModule } from './demo/es/es.module';
import { StableModule } from './management/monitor/stable/stable.module';
import { KafkaModule } from './common/kafka/kafka.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { TrackingController } from './tracking/tracking.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import TypeOrmConfig from './common/configs/typeorm.config';
import HttpConfig from './common/configs/http.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [HttpConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    KafkaModule.register({
      clientId: 'fed-monitor-kafka',
      brokers: ['49.234.134.123:9092'],
      groupId: 'fed-monitor-kafka',
    }),
    UsersModule,
    AuthModule,
    TrackingModule,
    EsModule,
    EsDemoModule,
    KafkaModule,
    StableModule,
  ],
  controllers: [AppController, UsersController, TrackingController],
  providers: [AppService, Logger],
})
export class AppModule {}
