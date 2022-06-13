import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

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

function setProperty(target: Record<string, any>, origin: Record<string, any>) {
  Object.entries(origin).forEach(([k, v]) => {
    if (k in target) target[k] = v;
  });
}

@Injectable()
export class TrackingService {
  constructor(
    // @InjectRepository(Report)
    // private readonly reportRepository: Repository<Report>,
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
    const breadcrumb = await Promise.all(
      createReportDto.breadcrumb.map((item) => this.saveBreadcrumb(item)),
    );
    const data = await this.saveData(createReportDto.data);
    const sdk = await Promise.all(
      createReportDto.sdk.map((item) => this.saveSdk(item)),
    );
    const browser = await this.preloadBrowserByContent(createReportDto.browser);
    const device = await this.preloadDeviceByContent(createReportDto.device);
    const os = await this.preloadOSByContent(createReportDto.os);

    const report = Object.assign(new Report(), createReportDto, {
      breadcrumb,
      data,
      sdk,
      browser,
      device,
      os,
    });
    return this.connection.manager.save(report);
  }

  private async saveBreadcrumb(createBreadbrumbDto: ReportBreadcrumbDto) {
    const breadcrumb = new ReportBreadcrumb();
    Object.assign(breadcrumb, createBreadbrumbDto);
    await this.connection.manager.save(breadcrumb);
    return breadcrumb;
  }

  private async saveData(createDataDto: ReportDataDto) {
    const data = new ReportData();
    Object.assign(data, createDataDto);
    await this.connection.manager.save(data);
    return data;
  }

  private async saveSdk(createSdkDto: ReportSdkDto) {
    const sdk = new ReportSdk();
    Object.assign(sdk, createSdkDto);
    await this.connection.manager.save(sdk);
    return sdk;
  }

  private async preloadBrowserByContent(dto: { content: string }) {
    let browser = await this.connection.manager.findOne(Browser, {
      where: dto,
    });
    if (!browser) {
      browser = new Browser();
      browser.content = dto.content;
      await this.connection.manager.save(browser);
    }
    return browser;
  }

  private async preloadDeviceByContent(dto: { content: string }) {
    let device = await this.connection.manager.findOne(Device, { where: dto });
    if (!device) {
      device = new Device();
      device.content = dto.content;
      await this.connection.manager.save(device);
    }
    return device;
  }

  private async preloadOSByContent(dto: { content: string }) {
    let os = await this.connection.manager.findOne(OperationSystem, {
      where: dto,
    });
    if (!os) {
      os = new OperationSystem();
      os.content = dto.content;
      await this.connection.manager.save(os);
    }
    return os;
  }
}
