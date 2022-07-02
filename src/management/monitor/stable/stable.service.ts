import { Injectable, Logger } from '@nestjs/common';
import { EsService } from '../../../lib/es/es.service';

@Injectable()
export class StableService {
  private readonly logger: Logger = new Logger();
  constructor(private readonly esService: EsService) {}

  /**
   * 获取稳定性监控数据
   */
  getStableList = async (params = {}) => {
    try {
      const result = await this.esService.searchBy(params);
      return result;
    } catch (error) {
      this.logger.error('getStableList is error', error);
    }
  };

  // 模拟数据上报
  handleReportData = async (data: any) => {
    try {
      const result = await this.esService.tracking(data);
      return result;
    } catch (error) {
      this.logger.error('handleReportData is error: ' + error);
    }
  };
}
