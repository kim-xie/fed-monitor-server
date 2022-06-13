import { Injectable } from '@nestjs/common';
import { EsService } from '../../lib/elasticsearch/elasticsearch.service';

@Injectable()
export class EsDemoService {
  constructor(private readonly esService: EsService) {}

  // 添加数据
  async add() {
    return await this.esService.bulk({
      body: [
        { index: { _index: 'news', _id: '1' } },
        { content: '模拟数据插入' },
      ],
    });
  }

  // 更新数据
  async update() {
    return await this.esService.bulk({
      body: [
        {
          update: { _index: 'news', _id: '1' },
        },
        // 仅仅是修改你改的字段,之前有的字段不会被删除
        { doc: { content: '我是被修改的数据' } },
      ],
    });
  }

  // 删除数据
  async delete() {
    return await this.esService.bulk({
      body: [
        {
          delete: { _index: 'news', _id: '1' },
        },
      ],
    });
  }

  // 查询数据
  async search() {
    return await this.esService.search({
      index: 'news',
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }

  // 查询数量
  async count() {
    return await this.esService.count({
      index: 'news',
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }
}
