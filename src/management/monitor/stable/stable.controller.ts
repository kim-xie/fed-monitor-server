import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
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
}
