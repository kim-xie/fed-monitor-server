import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TrackingService } from './tracking.service';

import { ReportDto } from './dto/report.dto';

@ApiBearerAuth()
@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('report')
  @ApiOperation({ summary: 'Upload report' })
  @ApiResponse({
    status: 200,
    description: 'upload report success',
  })
  @HttpCode(HttpStatus.OK)
  report(@Body() reportrDto: ReportDto): Promise<void> {
    return this.trackingService.report(reportrDto);
  }
}
