import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import * as StackTrace from 'stacktrace-js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // 如果有日志服务，可以在constructor,中挂载logger处理函数
  constructor(private readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const request = ctx.getRequest(); // 获取请求上下文中的request对象
    const response = ctx.getResponse(); // 获取请求上下文中的response对象
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // 获取异常状态码
    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${
          status >= 500
            ? '服务器错误（Service Error）'
            : '客户端错误（Client Error）'
        }`;

    const errorResponse = {
      data: null,
      message,
      code: -1,
    };
    // 将异常记录到logger中
    const msg = `${request.method} ${request.originalUrl} ${
      request.ip
    } query:${JSON.stringify(request.query)} params:${JSON.stringify(
      request.params,
    )} body:${JSON.stringify(
      request.body,
    )} code:${status} ${exception.toString()}`;
    this.logger.error(msg);
    // StackTrace.get().then((stack) => {
    //   // 将异常记录到logger中
    //   const msg = `${request.method} ${request.originalUrl} ${
    //     request.ip
    //   } query:${JSON.stringify(request.query)} params:${JSON.stringify(
    //     request.params,
    //   )} body:${JSON.stringify(
    //     request.body,
    //   )} code:${status} ${exception.toString()}`;
    //   this.logger.error(
    //     msg,
    //     stack.map((f) => f.toString()),
    //   );
    // });

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
