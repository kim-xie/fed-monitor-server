import { ApiProperty } from '@nestjs/swagger';

export class BrowserDto {
  @ApiProperty()
  content: string;
}
