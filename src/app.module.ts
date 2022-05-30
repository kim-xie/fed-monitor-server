import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

import { AppService } from './app.service';

import TypeOrmConfig from './common/configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    UsersModule,
    AuthModule,
    TrackingModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, Logger],
})
export class AppModule {}
