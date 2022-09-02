import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StableService } from './stable.service';

@ApiBearerAuth()
@ApiTags('stable')
@Controller('stable')
export class StableController {
  constructor(private readonly stableService: StableService) {}

  /**
   * 获取稳定性监控数据
   * @returns
   */
  @Get('list')
  @ApiOperation({ summary: 'list' })
  @HttpCode(HttpStatus.OK)
  async getStableList(@Query() query) {
    return await this.stableService.getStableList(query);
  }

  /**
   * 获取http统计面板数据
   * @param query
   * @returns
   */
  @Get('httpStatic')
  @ApiOperation({ summary: 'httpStatic' })
  @HttpCode(HttpStatus.OK)
  async getHttpStatics(@Query() query) {
    return await this.stableService.getHttpStatics(query);
  }

  /**
   * 获取http时间粒度数据
   * @param query
   * @returns
   */
  @Get('httpChangeDateInterval')
  @ApiOperation({ summary: 'httpChangeDateInterval' })
  @HttpCode(HttpStatus.OK)
  async getHttpChangeDateInterval(@Query() query) {
    return await this.stableService.getHttpHistogram(query);
  }

  /**
   * 模拟SDK数据上报
   * @param msg
   * @param headers
   * @param ip
   * @returns
   */
  @Post('tracking')
  @ApiOperation({ summary: 'tracking' })
  @HttpCode(HttpStatus.OK)
  async tracking(@Body() msg: any, @Headers() headers, @Ip() ip) {
    const contentType: string = headers['content-type'];
    const clientInfo = { ip, userAgent: headers['user-agent'] };
    /**
     * 1、支持sendbeacon、xhr、image这三种上报方式
     */
    if (contentType?.startsWith('application/json')) {
      // xhr
      msg.clientInfo = clientInfo;
      return await this.stableService.handleReportData(msg);
    } else {
      // sendBeacon
      const message = JSON.parse(msg);
      message.clientInfo = clientInfo;
      return await this.stableService.handleReportData(message);
    }
  }
}
