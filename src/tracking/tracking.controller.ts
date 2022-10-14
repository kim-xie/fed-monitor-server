import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  Res,
  Headers,
  Ip,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TrackingService } from './tracking.service';

import { ClientInfoDto } from './dto/report-clientInfo.dto';

@ApiBearerAuth()
@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  private readonly logger: Logger = new Logger(TrackingController.name);
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Upload report' })
  @ApiResponse({
    status: 200,
    description: 'upload report success',
  })
  @HttpCode(HttpStatus.OK)
  report(@Body() reportrDto: any, @Headers() headers, @Ip() ip): Promise<void> {
    console.log('headers', headers);
    const contentType: string = headers['content-type'];
    const clientInfo: ClientInfoDto = {
      ip,
      origin: headers['origin'],
      referer: headers['referer'],
      cookie: headers['cookie'],
      userAgent: headers['user-agent'],
      trackTime: Date.now(),
      uploadMode: contentType?.startsWith('application/json')
        ? 'xhr'
        : 'sendBeacon',
    };
    /**
     * 1、支持sendBeacon、xhr、img这三种上报方式
     */
    let sendMessage = reportrDto;
    if (contentType?.startsWith('application/json')) {
      // xhr
      sendMessage.clientInfo = clientInfo;
      this.logger.log('track by xhr: ', sendMessage);
    } else {
      // sendBeacon
      sendMessage = sendMessage && JSON.parse(sendMessage.toString());
      sendMessage.clientInfo = clientInfo;
      this.logger.log('track by sendBeacon: ', sendMessage);
    }
    return this.trackingService.sendReport(sendMessage);
  }

  @Get()
  @ApiOperation({ summary: 'Upload report' })
  @ApiResponse({
    status: 200,
    description: 'upload report success',
  })
  @HttpCode(HttpStatus.OK)
  imgReport(
    @Query() reportrDto: any,
    @Res() res: Response,
    @Headers() headers,
    @Ip() ip,
  ) {
    const clientInfo: ClientInfoDto = {
      ip,
      origin: headers['origin'],
      referer: headers['referer'],
      cookie: headers['cookie'],
      userAgent: headers['user-agent'],
      trackTime: Date.now(),
      uploadMode: 'img',
    };
    /**
     * 1、image上报方式
     */
    const sendMessage = JSON.parse(reportrDto?.data);
    sendMessage.clientInfo = clientInfo;
    this.logger.log('track by img: ', sendMessage);
    this.trackingService.sendReport(sendMessage);
    const imgPath = join(__dirname, '../../static/img/tracker.gif');
    res.sendFile(imgPath);
  }

  @Get('/timeCheck')
  @ApiOperation({ summary: 'timeCheck' })
  @ApiResponse({
    status: 200,
    description: 'timeCheck success',
  })
  @HttpCode(HttpStatus.OK)
  timeCheck(@Res() res: Response) {
    res.send({ serverTime: Date.now() });
  }
}
