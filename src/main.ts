import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

const logger = new Logger();

async function bootstrap() {
  // 创建实例
  const app = await NestFactory.create(AppModule);
  // 定义全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 使用全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  // 使用swagger生成API文档
  const options = new DocumentBuilder()
    .setTitle('Monitor example')
    .setDescription('The monitor API description')
    .setVersion('1.0')
    .addTag('monitor')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(9999);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
