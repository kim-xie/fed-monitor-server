import { ApiProperty } from '@nestjs/swagger';

import { ClientInfoDto } from './report-clientInfo.dto';
import { ReportInfoDto } from './report-reportInfo.dto';
import { ReportAuthInfoDto } from './report-authInfo.dto';

export class ReportDto {
  @ApiProperty()
  reportInfo: ReportInfoDto[];

  @ApiProperty()
  authInfo: ReportAuthInfoDto;

  @ApiProperty()
  clientInfo?: ClientInfoDto;

  @ApiProperty()
  deviceInfo?: any;
}
