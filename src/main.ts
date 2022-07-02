import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception';
import { AllExceptionsFilter } from './common/filters/all-exception';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { logger } from './common/middlewares/logger-middleware';

// import helmet from 'helmet';
// import csurf from 'csurf';

// import { microserviceConfig } from './common/configs/microservice.config';

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

  //cors：跨域资源共享
  app.enableCors({
    origin: true,
    credentials: true,
  });

  //防止跨站脚本攻击
  // app.use(helmet());

  //CSRF保护：跨站点请求伪造
  // app.use(csurf());

  // kafka
  // app.connectMicroservice(microserviceConfig);
  // await app.startAllMicroservicesAsync();

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
