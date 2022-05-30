import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import LoggerConfig from './common/configs/logger.config';

function useSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Monitor example')
    .setDescription('The monitor API description')
    .setVersion('1.0')
    .addTag('monitor')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const logger = WinstonModule.createLogger(LoggerConfig);
  // 创建实例
  const app = await NestFactory.create(AppModule, { logger });

  // 定义全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 使用全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  // 使用swagger生成API文档
  useSwagger(app);

  await app.listen(9999);
  app.get(Logger).log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
