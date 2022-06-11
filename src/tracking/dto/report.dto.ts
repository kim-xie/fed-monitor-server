import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { ReportBreadcrumbDto } from './report-breadcrumb.dto';
import { ReportDataDto } from './report-data.dto';
import { ReportSdkDto } from './report-sdk.dto';

export class ReportDto {
  @IsOptional()
  @ApiProperty()
  breadcrumb: ReportBreadcrumbDto[];

  @IsOptional()
  @ApiProperty()
  data: ReportDataDto;

  @IsOptional()
  @ApiProperty()
  sdk: ReportSdkDto[];

  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  apiEnv: string;

  @ApiProperty()
  traceId: string;
}
