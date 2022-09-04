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
}
