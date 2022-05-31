import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception';
import { AllExceptionsFilter } from './common/filters/all-exception';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { logger } from './common/middlewares/logger-middleware';

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
  // 创建实例
  const app = await NestFactory.create(AppModule, { logger });

  // 定义全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Logger)));
  // 使用全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  // 使用swagger生成API文档
  useSwagger(app);

  await app.listen(9999);
  app.get(Logger).log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
