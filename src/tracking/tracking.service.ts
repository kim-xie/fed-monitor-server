import { Injectable, Logger } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { EsService } from 'src/lib/es/es.service';
import { SubscribeTo } from '../common/kafka/kafka.decorator';
import { KafkaService } from '../common/kafka/kafka.service';
import { KafkaPayload } from '../common/kafka/kafka.message';
// import { REPORT_FIXED_TOPIC } from '../common/constants';

@Injectable()
export class TrackingService {
  private readonly logger: Logger = new Logger(TrackingService.name);
  constructor(
    private readonly kafka: KafkaService,
    private readonly esService: EsService,
  ) {}

  /**
   * kafka 生产者
   * @param createReportDto
   * @returns
   */
  async sendReport(createReportDto: ReportDto): Promise<any> {
    const payload: KafkaPayload = {
      messageId: '' + new Date().valueOf(),
      body: createReportDto,
      messageType: 'Report',
      topicName: 'tracking.report',
    };
    const value = await this.kafka.sendMessage('tracking.report', payload);
    this.logger.log('kafka status ', value);
    return createReportDto;
  }
  /**
   * Kafka消费者
   * @param payload
   */
  @SubscribeTo('tracking.report')
  reportSubscriber(payload: KafkaPayload) {
    this.logger.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    this.tracking(payload);
  }

  /**
   * SDK上报数据持久化(消费kafka数据)
   * @param data
   */
  async tracking(data: any) {
    // 1、数据格式处理
    const { authInfo, clientInfo, reportInfo } = data;
    // 2、解构数据
    const dataList = reportInfo?.map((reportItem: any) => {
      const { data, breadcrumb } = reportItem;
      const index = this.esService.getEsIndex({ ...data, ...authInfo });
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
      const bulkResponse = await this.esService.bulk({ body });
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
}
