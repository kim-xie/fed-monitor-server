import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';

import { ReportDto } from './dto/report.dto';
import { ReportBreadcrumbDto } from './dto/report-breadcrumb.dto';
import { ReportDataDto } from './dto/report-data.dto';
import { ReportSdkDto } from './dto/report-sdk.dto';

import { Report } from './entity/report.entity';
import { ReportBreadcrumb } from './entity/report-breadcrumb.entity';
import { ReportData } from './entity/report-data.entity';
import { ReportSdk } from './entity/report-sdk.entity';
import { Browser } from './entity/browser.entity';
import { Device } from './entity/device.entity';
import { OperationSystem } from './entity/os.entity';

function filter({ id, ...params }: Record<string, any> = {}) {
  return params;
}

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    // @InjectRepository(ReportBreadcrumb)
    // private readonly reportBreadcrumbRepository: Repository<ReportBreadcrumb>,
    // @InjectRepository(ReportData)
    // private readonly reportDataRepository: Repository<ReportData>,
    // @InjectRepository(ReportSdk)
    // private readonly reportSdkRepository: Repository<ReportSdk>,
    // @InjectRepository(Browser)
    // private readonly browserRepository: Repository<Browser>,
    // @InjectRepository(Device)
    // private readonly deviceRepository: Repository<Device>,
    // @InjectRepository(OperationSystem)
    // private readonly osRepository: Repository<OperationSystem>,
    private readonly connection: Connection,
  ) {}

  async report(createReportDto: ReportDto): Promise<any> {
    // this.connection.transaction((manager) => {

    // });
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      const breadcrumb = await Promise.all(
        createReportDto.breadcrumb.map((item) =>
          this.saveBreadcrumb(item, runner.manager),
        ),
      );
      const data = await this.saveData(createReportDto.data, runner.manager);
      const sdk = await Promise.all(
        createReportDto.sdk.map((item) => this.saveSdk(item, runner.manager)),
      );
      const browser = await this.preloadBrowserByContent(
        createReportDto.browser,
        runner.manager,
      );
      const device = await this.preloadDeviceByContent(
        createReportDto.device,
        runner.manager,
      );
      const os = await this.preloadOSByContent(
        createReportDto.os,
        runner.manager,
      );

      const report = Object.assign(new Report(), createReportDto, {
        breadcrumb,
        data,
        sdk,
        browser,
        device,
        os,
      });
      await runner.manager.save(report);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw new SyntaxError(error);
    }
  }

  async findAll(): Promise<any> {
    const result = await this.reportRepository.find({
      relations: ['breadcrumb', 'data', 'sdk', 'device', 'browser', 'os'],
      loadRelationIds: false,
    });

    return result.map(
      ({ device, browser, os, breadcrumb, data, sdk, ...rest }) => {
        return {
          ...filter(rest),
          device: device?.content || '',
          browser: browser?.content || '',
          os: os?.content || '',
          breadcrumb: breadcrumb.map(filter),
          sdk: sdk.map(filter),
          data: filter(data),
        };
      },
    );
  }

  async findOne(traceId: string): Promise<any> {
    const { device, browser, os, breadcrumb, data, sdk, ...rest } =
      await this.reportRepository.findOne({
        relations: ['breadcrumb', 'data', 'sdk', 'device', 'browser', 'os'],
        loadRelationIds: false,
        where: { traceId },
      });

    return {
      ...filter(rest),
      device: device?.content || '',
      browser: browser?.content || '',
      os: os?.content || '',
      breadcrumb: breadcrumb?.map(filter),
      sdk: sdk?.map(filter),
      data: filter(data),
    };
  }

  private async saveBreadcrumb(
    createBreadbrumbDto: ReportBreadcrumbDto,
    manager: EntityManager,
  ) {
    const breadcrumb = new ReportBreadcrumb();
    Object.assign(breadcrumb, createBreadbrumbDto);
    await manager.save(breadcrumb);
    return breadcrumb;
  }

  private async saveData(createDataDto: ReportDataDto, manager: EntityManager) {
    const data = new ReportData();
    Object.assign(data, createDataDto);
    await manager.save(data);
    return data;
  }

  private async saveSdk(createSdkDto: ReportSdkDto, manager: EntityManager) {
    const sdk = new ReportSdk();
    Object.assign(sdk, createSdkDto);
    await manager.save(sdk);
    return sdk;
  }

  private async preloadBrowserByContent(
    content: string,
    manager: EntityManager,
  ) {
    let browser = await manager.findOne(Browser, {
      where: { content },
    });
    if (!browser) {
      browser = new Browser();
      browser.content = content;
      await manager.save(browser);
    }
    return browser;
  }

  private async preloadDeviceByContent(
    content: string,
    manager: EntityManager,
  ) {
    let device = await manager.findOne(Device, { where: { content } });
    if (!device) {
      device = new Device();
      device.content = content;
      await manager.save(device);
    }
    return device;
  }

  private async preloadOSByContent(content: string, manager: EntityManager) {
    let os = await manager.findOne(OperationSystem, {
      where: { content },
    });
    if (!os) {
      os = new OperationSystem();
      os.content = content;
      await manager.save(os);
    }
    return os;
  }
}
