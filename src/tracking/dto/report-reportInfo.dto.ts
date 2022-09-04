import { ApiProperty } from '@nestjs/swagger';
import { ReportBreadcrumbDto } from './report-breadcrumb.dto';
import { ReportDataDto } from './report-data.dto';

export class ReportInfoDto {
  @ApiProperty()
  data: ReportDataDto;

  @ApiProperty()
  breadcrumb: ReportBreadcrumbDto[];
}
