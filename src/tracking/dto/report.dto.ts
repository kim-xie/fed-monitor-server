import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { ReportBreadcrumbDto } from './report-breadcrumb.dto';
import { ReportDataDto } from './report-data.dto';
import { ReportSdkDto } from './report-sdk.dto';
import { BrowserDto } from './borwser.dto';
import { DeviceDto } from './device.dto';
import { OSDto } from './os.dto';

export class ReportDto {
  @ApiProperty()
  breadcrumb: ReportBreadcrumbDto[];

  @ApiProperty()
  data: ReportDataDto;

  @ApiProperty()
  sdk: ReportSdkDto[];

  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  apiEnv: string;

  @ApiProperty()
  traceId: string;

  @ApiProperty()
  ip: string;

  // @IsOptional()
  @ApiProperty()
  browser: string;

  // @IsOptional()
  @ApiProperty()
  device: string;

  // @IsOptional()
  @ApiProperty()
  os: string;
}
