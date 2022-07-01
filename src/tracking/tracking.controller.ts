import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TrackingService } from './tracking.service';

import { ReportDto } from './dto/report.dto';
import { Report } from './entity/report.entity';

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

  @Get('/all')
  @ApiOperation({ summary: 'Find all reports' })
  @ApiResponse({
    status: 200,
    description: 'The found reports',
  })
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Report[]> {
    return this.trackingService.findAll();
  }

  @Get(':traceId')
  @ApiOperation({ summary: 'Find user' })
  @ApiResponse({
    status: 200,
    description: 'The founded report.',
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('traceId') traceId: string): Promise<Report> {
    return this.trackingService.findOne(traceId);
  }
}
