import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';

import { Report } from './entity/report.entity';
import { ReportBreadcrumb } from './entity/report-breadcrumb.entity';
import { ReportData } from './entity/report-data.entity';
import { ReportSdk } from './entity/report-sdk.entity';
import { OperationSystem } from './entity/os.entity';
import { Device } from './entity/device.entity';
import { Browser } from './entity/browser.entity';

// import { TrackingController } from './tracking.controller';

import { TrackingService } from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ReportBreadcrumb,
      ReportData,
      ReportSdk,
      Browser,
      Device,
      OperationSystem,
    ]),
  ],
  providers: [TrackingService],
  // controllers: [TrackingController],
  exports: [TypeOrmModule, TrackingService],
})
export class TrackingModule {}
