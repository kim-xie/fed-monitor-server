import { ApiProperty } from '@nestjs/swagger';

export class ReportDataDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  extends: Record<string, any>;
}
