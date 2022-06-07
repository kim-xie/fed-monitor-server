import { Module } from '@nestjs/common';

import { EsDemoService } from './es.service';
import { EsDemoController } from './es.controller';

@Module({
  providers: [EsDemoService],
  controllers: [EsDemoController],
  exports: [EsDemoService],
})
export class EsDemoModule {}
