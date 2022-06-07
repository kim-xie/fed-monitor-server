import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';

import { Report } from './entity/report.entity';
import { ReportBreadcrumb } from './entity/report-breadcrumb.entity';
import { ReportData } from './entity/report-data.entity';
import { ReportSdk } from './entity/report-sdk.entity';

// import { TrackingController } from './tracking.controller';

import { TrackingService } from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportBreadcrumb, ReportData, ReportSdk]),
  ],
  providers: [TrackingService],
  // controllers: [TrackingController],
  exports: [TypeOrmModule, TrackingService],
})
export class TrackingModule {}
