import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty()
  content: string;
}
