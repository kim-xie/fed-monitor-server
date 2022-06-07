import { ApiProperty } from '@nestjs/swagger';

export class ReportBreadcrumbDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  data: string | JSON;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  time?: number;

  @ApiProperty()
  level: string;
}
