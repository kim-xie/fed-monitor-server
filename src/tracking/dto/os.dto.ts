import { ApiProperty } from '@nestjs/swagger';

export class OSDto {
  @ApiProperty()
  content: string;
}
