import { ApiProperty } from '@nestjs/swagger';

import { ReportBreadcrumbDto } from './report-breadcrumb.dto';
import { ReportDataDto } from './report-data.dto';
import { ReportSdkDto } from './report-sdk.dto';

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

  @ApiProperty()
  browser: string;

  @ApiProperty()
  device: string;

  @ApiProperty()
  os: string;
}
