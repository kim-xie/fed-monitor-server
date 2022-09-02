import { Injectable, Logger } from '@nestjs/common';
import { EsService } from 'src/lib/es/es.service';
import dayjs, { msofUtil, IDateUtil } from 'src/utils/dateUtil';

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

  // -----------------------------HTTP 统计------------------------------
  /**
   * http统计
   * @param params
   * @returns
   */
  getHttpStatics = async (params = {}) => {
    try {
      const startTime = new Date().getTime();
      const stats = this.getHttpStats(params);
      const status = this.getHttpStatusCode(params);
      const histogram = this.getHttpHistogram(params);
      const top = this.getHttpTopTen(params);
      const all = await Promise.all([stats, status, histogram, top]);
      const endTime = new Date().getTime();
      console.log('statics spendTime', endTime - startTime);
      const result = {};
      all.forEach((item) => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach((key) => {
            result[key] = item[key];
          });
        }
      });
      return result;
    } catch (error) {
      this.logger.error('getHttpStatics is error', error);
      return {
        errors: error,
        meta: {
          success: false,
        },
      };
    }
  };

  /**
   * 获取http统计索引
   * @param params
   * @returns
   */
  gethttpIndex = (params: any) => {
    const timeFormat = 'YYYYMMDD';
    const {
      category,
      type,
      subType = '*',
      apiKey,
      startTime = dayjs().format(timeFormat),
      endTime = dayjs().format(timeFormat),
    } = params;

    let index = '';
    let date = endTime;
    // 起始时间
    if (startTime && endTime && startTime !== endTime) {
      const day = dayjs(endTime).diff(startTime, 'day');
      const dateArr = [];
      for (let i = 0; i <= day; i++) {
        dateArr.push(dayjs(startTime).add(i, 'day').format(timeFormat));
      }
      date = dateArr;
    }

    if (date && Array.isArray(date)) {
      index = date
        .map((item) => {
          return this.esService.getEsIndex({
            apiKey,
            date: item,
            category,
            type,
            subType,
          });
        })
        .join(',');
    } else {
      index = this.esService.getEsIndex({
        apiKey,
        date,
        category,
        type,
        subType,
      });
    }

    return index;
  };

  /**
   * 指定时间段
   * http报错总数、
   * 平均耗时、
   * 接口个数、
   * 页面个数
   * @param params
   * @returns
   */
  getHttpStats = async (params: any) => {
    const index = this.gethttpIndex(params);
    const body = {
      size: 0,
      aggs: {
        url_count: {
          value_count: {
            field: 'data.request.url.keyword',
          },
        },
        url_spend_avg_time: {
          avg: {
            field: 'data.spendTime',
          },
        },
        url_total: {
          cardinality: {
            field: 'data.request.url.keyword',
          },
        },
        page_total: {
          cardinality: {
            field: 'data.pageUrl.keyword',
          },
        },
      },
    };

    const result = await this.esService.search({
      index,
      body,
    });

    // 结果解析
    const resultParse = (result: any) => {
      const data = result?.aggregations || {};
      const newResult = {};
      Object.keys(data).forEach((key) => {
        newResult[key] = data[key].value;
      });
      return newResult;
    };

    return resultParse(result);
  };

  /**
   * 统计指定时间段 网络状态码、业务状态码
   * @param params
   * @returns
   */
  getHttpStatusCode = async (params: any) => {
    const index = this.gethttpIndex(params);
    // 网络状态码
    const http_body = {
      query: {
        bool: {
          must_not: [
            {
              term: {
                'data.response.status': {
                  value: 200,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        http_status: {
          terms: {
            field: 'data.response.status',
            size: 10000,
          },
        },
      },
    };

    // 业务状态码
    const biz_body = {
      query: {
        bool: {
          must: [
            {
              term: {
                'data.response.status': {
                  value: 200,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        biz_status: {
          terms: {
            field: 'data.response.errorCode',
            size: 10000,
          },
        },
      },
    };

    const http_result = this.esService.search({
      index,
      body: http_body,
    });

    const biz_result = this.esService.search({
      index,
      body: biz_body,
    });

    const result = await Promise.all([http_result, biz_result]);

    // 结果解析
    const resultParse = (result: any) => {
      if (result?.length && Array.isArray(result)) {
        const statusObj = {};
        result.forEach((item: any) => {
          const aggregations = item?.aggregations;
          Object.keys(aggregations).forEach((key) => {
            statusObj[key] = aggregations[key].buckets?.map((bucket) => ({
              code: bucket.key,
              count: bucket.doc_count,
            }));
          });
        });
        return statusObj;
      }
    };

    return resultParse(result);
  };

  /**
   * 获取http报错直方图数据
   * @param params
   * @returns
   */
  getHttpHistogram = async (params: any) => {
    const index = this.gethttpIndex(params);
    const { interval = '1d', startTime, endTime } = params;

    let interval_value = interval;
    if (typeof interval === 'string') {
      const reg = /^(?<num>\d+)(?<util>[a-zA-Z])$/;
      const { num, util } = interval.match(reg).groups;
      if (num && util) {
        interval_value = msofUtil(util as IDateUtil) * Number(num);
      }
    }

    const fromDate = dayjs(startTime).startOf('D').valueOf();
    const toDate = dayjs(endTime).endOf('D').valueOf();

    const body = {
      query: {
        bool: {
          must: [
            {
              range: {
                'data.timestamp': {
                  gte: fromDate, // 大于等于
                  lte: toDate, // 小于
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        date_total: {
          histogram: {
            field: 'data.timestamp',
            interval: interval_value, // 时间粒度
            min_doc_count: 0, // 默认没有数据用0填充
            offset: fromDate,
            extended_bounds: {
              // 指定统计区间
              min: fromDate,
              max: toDate,
            },
          },
        },
      },
    };

    const result = await this.esService.search({
      index,
      body,
    });

    // 结果解析
    const resultParse = (result: any) => {
      if (result?.aggregations?.date_total) {
        const { buckets = [] } = result.aggregations.date_total;
        const date_list = buckets.map((item: any) => ({
          date: dayjs(item.key).format(
            interval.includes('d') ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm',
          ),
          value: item.doc_count,
        }));
        return { date_list };
      }
    };

    return resultParse(result);
  };

  /**
   * http接口、页面top10统计
   * @param params
   * @returns
   */
  getHttpTopTen = async (params: any) => {
    const index = this.gethttpIndex(params);
    // 业务接口报错TOP10
    const biz_top_body = {
      query: {
        bool: {
          must: [
            {
              term: {
                'data.response.status': {
                  value: 200,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        biz_url_top: {
          terms: {
            field: 'data.request.url.keyword',
            size: 10,
            order: {
              _count: 'desc',
            },
          },
        },
      },
    };

    // 网络接口报错TOP10
    const http_top_body = {
      query: {
        bool: {
          must_not: [
            {
              term: {
                'data.response.status': {
                  value: 200,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        http_url_top: {
          terms: {
            field: 'data.request.url.keyword',
            size: 10,
            order: {
              _count: 'desc',
            },
          },
        },
      },
    };

    // 报错页面TOP10
    const page_top_body = {
      size: 0,
      aggs: {
        page_top: {
          terms: {
            field: 'data.pageUrl.keyword',
            size: 10,
            order: {
              _count: 'desc',
            },
          },
        },
      },
    };

    const biz_top_result = this.esService.search({
      index,
      body: biz_top_body,
    });

    const http_top_result = this.esService.search({
      index,
      body: http_top_body,
    });

    const page_top_result = this.esService.search({
      index,
      body: page_top_body,
    });

    const result = await Promise.all([
      biz_top_result,
      http_top_result,
      page_top_result,
    ]);

    // 结果解析
    const resultParse = (result: any) => {
      if (result?.length && Array.isArray(result)) {
        const topObj = {};
        result.forEach((item: any) => {
          const aggregations = item?.aggregations;
          Object.keys(aggregations).forEach((key) => {
            topObj[key] = aggregations[key].buckets?.map((bucket) => ({
              url: bucket.key,
              count: bucket.doc_count,
            }));
          });
        });
        return topObj;
      }
    };

    return resultParse(result);
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
