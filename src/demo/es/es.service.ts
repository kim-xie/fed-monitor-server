import { Injectable } from '@nestjs/common';
import { EsService } from '../../lib/es/es.service';

@Injectable()
export class EsDemoService {
  constructor(private readonly esService: EsService) {}

  // 添加数据
  async add() {
    return await this.esService.bulk({
      body: [
        {
          index: {
            _index:
              'fed-monitor-20220702-performance-performance-resourcetiming',
          },
        },
        {
          data: {
            subType: 'resourceTiming',
            data: {
              connectEnd: 103.89999997615814,
              connectStart: 103.89999997615814,
              decodedBodySize: 0,
              domainLookupEnd: 103.89999997615814,
              domainLookupStart: 103.89999997615814,
              duration: 26.199999928474426,
            },
            category: 'performance',
            type: 'performance',
            level: 'low',
            timestamp: 1656760459344,
            errorId: 1628592578,
            pageUrl: 'http://localhost:2021/JS/index.html',
            pageTitle: 'native-js-demo',
          },
          clientInfo: JSON.stringify({
            ip: '::1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          }),
        },
        {
          index: {
            _index:
              'fed-monitor-20220702-performance-performance-resourcetiming',
          },
        },
        {
          data: {
            subType: 'resourceTiming',
            data: {
              connectEnd: 103.89999997615814,
              connectStart: 103.89999997615814,
              decodedBodySize: 0,
              domainLookupEnd: 103.89999997615814,
              domainLookupStart: 103.89999997615814,
              duration: 26.199999928474426,
            },
            category: 'performance',
            type: 'performance',
            level: 'low',
            timestamp: 1656760459346,
            errorId: -891367356,
            pageUrl: 'http://localhost:2021/JS/index.html',
            pageTitle: 'native-js-demo',
          },
          clientInfo: JSON.stringify({
            ip: '::1',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          }),
        },
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
