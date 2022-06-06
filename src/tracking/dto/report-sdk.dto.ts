import { ApiProperty } from '@nestjs/swagger';

export class ReportSdkDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;
}
