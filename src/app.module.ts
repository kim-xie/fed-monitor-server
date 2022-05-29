import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '49.234.134.123',
      port: 3306,
      username: 'root',
      password: 'P@ssw0rd',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TrackingModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
