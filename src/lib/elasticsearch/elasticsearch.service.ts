import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';

/**
 * es api: https://www.elastic.co/guide/en/elasticsearch/reference/8.2/docs.html
 */
@Injectable()
export class EsService {
  constructor(private readonly esService: ElasticsearchService) {}

  // 获取es服务
  getEsClient() {
    return this.esService;
  }

  // 添加、修改、删除数据
  async bulk(params: any) {
    return await this.esService.bulk(params);
  }

  // 查询数据
  async search(params: any) {
    return await this.esService.search(params);
  }

  // 查询数量
  async count(params: any) {
    return await this.esService.count(params);
  }
}
