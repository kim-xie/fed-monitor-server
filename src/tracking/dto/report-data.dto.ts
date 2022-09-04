import { ApiProperty } from '@nestjs/swagger';

export class ReportDataDto {
  @ApiProperty()
  category: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  subType: string;

  @ApiProperty()
  pageUrl: string;

  @ApiProperty()
  pageTitle: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  errorId?: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  extends: Record<string, any>;
}
