import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';
import { EsModule } from './lib/elasticsearch/elasticsearch.module';
import { EsDemoModule } from './demo/es/es.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { TrackingController } from './tracking/tracking.controller';

import { AppService } from './app.service';

import TypeOrmConfig from './common/configs/typeorm.config';
// import { LoggerMiddleware } from './common/middlewares/logger-middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    UsersModule,
    AuthModule,
    TrackingModule,
    EsModule,
    EsDemoModule,
  ],
  controllers: [AppController, UsersController, TrackingController],
  providers: [AppService, Logger],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
