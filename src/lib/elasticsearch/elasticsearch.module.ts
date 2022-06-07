import { Module, Global } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EsService } from './elasticsearch.service';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://49.234.134.123:9200',
      }),
    }),
  ],
  providers: [EsService],
  exports: [EsService],
})
export class EsModule {}
