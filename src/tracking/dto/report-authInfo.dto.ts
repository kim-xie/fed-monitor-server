import { ApiProperty } from '@nestjs/swagger';

export class ReportAuthInfoDto {
  @ApiProperty()
  trackerId?: string;

  @ApiProperty()
  sdkVersion: string;

  @ApiProperty()
  sdkName: string;

  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  apiEnv: string;

  @ApiProperty()
  userId: string;
}
