import {
  Controller,
  OnModuleInit,
  OnModuleDestroy,
  Get,
  UseFilters,
  Inject,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AllExceptionsFilter } from '../../common/filters/all-exception';

@Controller('kafka')
export class KafkaController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('fed-monitor-kafka') private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    ['hello', 'error', 'skip'].forEach((key) =>
      this.kafka.subscribeToResponseOf(`say.${key}`),
    );
  }

  onModuleDestroy() {
    this.kafka.close();
  }

  @Get()
  sayHello() {
    return this.kafka.send('say.hello', { ip: '127.0.0.1' });
  }

  @Get('error')
  @UseFilters(AllExceptionsFilter)
  sayError() {
    return this.kafka.send('say.error', { ip: '127.0.0.1' });
  }

  @Get('skip')
  saySkip() {
    return this.kafka.send('say.skip', { ip: '127.0.0.1' });
  }
}
