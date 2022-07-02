import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';

/**
 * es api: https://www.elastic.co/guide/en/elasticsearch/reference/8.2/docs.html
 */
@Injectable()
export class EsService {
  private readonly logger: Logger = new Logger();
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

  /**
   * 获取es索引
   * @param params
   * @returns
   */
  private getEsIndex(params: any) {
    const {
      date = dayjs().format('YYYYMMDD'),
      category = '',
      type = '',
      subType = '',
    } = params;

    if (!category) {
      this.logger.error('category is required');
      return;
    }

    if (!type) {
      this.logger.error('type is required');
      return;
    }

    let index = `fed-monitor-${date}-${category.toLowerCase()}-${type.toLowerCase()}`;

    if (subType) {
      index += `-${subType.toLowerCase()}`;
    }

    return index;
  }

  /**
   * SDK上报数据持久化(消费kafka数据)
   * @param data
   */
  async tracking(data: any) {
    // 1、数据格式处理
    const { authInfo, clientInfo, reportInfo } = data;
    // 解构数据
    const dataList = reportInfo?.map((reportItem: any) => {
      const { data, breadcrumb } = reportItem;
      const index = this.getEsIndex(data);
      this.logger.log('create index: ' + index);
      if (!index) {
        this.logger.error('index can not be empty index = ' + index);
        return;
      }

      if (breadcrumb?.length) {
        breadcrumb.forEach((item: any) => {
          item.data = JSON.stringify(item.data);
        });
      }

      return {
        index,
        doc: {
          ...reportItem,
          authInfo,
          clientInfo,
        },
      };
    });

    // 数据扁平化
    const body = dataList?.flatMap(({ index, doc }) => [
      {
        index: { _index: index },
      },
      { ...doc },
    ]);

    // 2、数据批量入库
    try {
      const bulkResponse = await this.bulk({ body });
      // 3、异常处理
      if (bulkResponse.errors) {
        const erroredDocuments = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            const { status, error } = action[operation];
            erroredDocuments.push({
              // If the status is 429 it means that you can retry the document,
              // otherwise it's very likely a mapping error, and you should
              // fix the document before to try it again.
              status,
              error,
              // operation: body[i * 2],
              // document: body[i * 2 + 1],
            });
          }
        });
        this.logger.log(
          'bulk operate erroredDocuments= ' + JSON.stringify(erroredDocuments),
        );
        return false;
      }
    } catch (err) {
      this.logger.error('bulk operate is error:' + err);
      return false;
    }
    return true;
  }

  /**
   * 删除数据
   * @param params
   * @returns
   */
  async delete(params: any) {
    console.log('delete params', params);
    const { date, category, type, subType } = params;
    const index = this.getEsIndex({ date, category, type, subType });
    if (!index) {
      this.logger.error('index can not be empty index = ' + index);
      return;
    }
    return await this.bulk({
      body: [
        {
          delete: { _index: index },
        },
      ],
    });
  }

  /**
   * 分页查询
   * @param params
   * @returns
   */
  async searchBy(params: any) {
    const {
      date,
      category,
      type,
      subType = '*',
      project,
      apiEnv,
      pageNo,
      pageSize,
      source = [],
    } = params;

    const index = this.getEsIndex({ date, category, type, subType });

    this.logger.log('search index: ' + index);

    if (!index) {
      this.logger.error('index can not be empty index = ' + index);
      return;
    }

    // 默认查询所有
    let query: any = {
      match_all: {},
    };

    // 按项目查询
    if (project && project !== 'all') {
      query = {
        match: {
          'authInfo.apiKey.keyword': project,
        },
      };
    }

    // 按项目环境查询
    if (apiEnv) {
      query = {
        match: {
          ...query.match,
          'authInfo.apiEnv.keyword': apiEnv,
        },
      };
    }

    const from = pageNo > 0 ? pageNo - 1 : 0;
    const size = pageSize || 10;

    const searchDatas: any = await this.search({
      index,
      body: {
        query,
        from,
        size,
        _source: source,
      },
    });

    const resultObj = {
      total: searchDatas?.hits.total.value || 0,
      list: searchDatas?.hits.hits || [],
      pageNo: from + 1,
      pageSize: size,
    };

    this.logger.log('search result: ' + JSON.stringify(resultObj));

    return resultObj;
  }

  // 查询数量
  async getCount(params: any) {
    const { date, category, type, subType } = params;
    const index = this.getEsIndex({ date, category, type, subType });
    if (!index) {
      this.logger.error('index can not be empty index = ' + index);
      return;
    }
    return await this.count({
      index,
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }
}