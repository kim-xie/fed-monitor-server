import { ApiProperty } from '@nestjs/swagger';

export class ReportBreadcrumbDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  data: string | Record<string, any>;

  @ApiProperty()
  category: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  time: number;
}
