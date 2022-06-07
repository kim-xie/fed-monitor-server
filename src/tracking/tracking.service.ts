import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReportDto } from './dto/report.dto';

import { Report } from './entity/report.entity';
import { ReportBreadcrumb } from './entity/report-breadcrumb.entity';
import { ReportData } from './entity/report-data.entity';
import { ReportSdk } from './entity/report-sdk.entity';

function setProperty(target: Record<string, any>, origin: Record<string, any>) {
  Object.entries(origin).forEach(([k, v]) => {
    if (k in target) target[k] = v;
  });
}

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async report(params: ReportDto): Promise<void> {
    const { breadcrumb, data, sdk, ...rest } = params;
    // const breadcrumbIds = breadcrumb.map(async (item) => {
    //   const { id } = await this.saveBreadcrumb(item);
    //   return id;
    // });
    // const { id: dataId } = await this.saveData(data);
    // const { id: sdkId } = await this.saveSdk(sdk);

    // const report = new Report();
    // report.breadcrumbId = breadcrumbIds.join(',');
    // report.dataId = dataId + '';
    // report.sdkId = sdkId + '';

    // Object.entries(rest).forEach(([k, v]) => {
    //   report[k] = v;
    // });

    const runner = this.reportRepository.queryRunner;
    await runner.connect();
    await runner.startTransaction();

    try {
      const report = new Report();
      setProperty(report, rest);
      await runner.manager.save(report);

      breadcrumb.map(async (item) => {
        const breadcrumb = new ReportBreadcrumb();
        setProperty(breadcrumb, item);
        await runner.manager.save(breadcrumb);
      });
      // await runner.manager.save();
      const dataIns = new ReportData();
      setProperty(dataIns, data);
      await runner.manager.save(dataIns);

      const sdkIns = new ReportSdk();
      setProperty(sdkIns, sdk);
      await runner.manager.save(sdkIns);

      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
  }

  // saveBreadcrumb(params: ReportBreadcrumbDto) {
  //   return this.breadcrumbRepository.save(params);
  // }
  // saveData(params: ReportDataDto) {
  //   return this.dataRepository.save(params);
  // }
  // saveSdk(params: ReportSdkDto) {
  //   return this.sdkRepository.save(params);
  // }
  // saveReport(params: ReportDto) {
  //   return this.reportRepository.save(params);
  // }
}
