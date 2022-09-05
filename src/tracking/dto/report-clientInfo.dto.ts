import { ApiProperty } from '@nestjs/swagger';

export class ClientInfoDto {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  trackTime: number;

  @ApiProperty()
  uploadMode: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  referer: string;

  @ApiProperty()
  cookie: string;
}
