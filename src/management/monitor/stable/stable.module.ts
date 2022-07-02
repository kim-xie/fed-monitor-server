import { Module } from '@nestjs/common';
import { StableService } from './stable.service';
import { StableController } from './stable.controller';

@Module({
  providers: [StableService],
  controllers: [StableController],
  exports: [StableService],
})
export class StableModule {}
