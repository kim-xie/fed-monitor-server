import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ReportBreadcrumb } from './report-breadcrumb.entity';
import { ReportData } from './report-data.entity';
import { ReportSdk } from './report-sdk.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ReportBreadcrumb, (breadcrumb) => breadcrumb.report)
  @JoinColumn()
  @ApiProperty()
  breadcrumb: ReportBreadcrumb[];

  @OneToOne(() => ReportData)
  @JoinColumn()
  @ApiProperty()
  data: ReportData;

  @OneToMany(() => ReportSdk, (sdk) => sdk.report)
  @JoinColumn()
  @ApiProperty()
  sdk: ReportSdk[];

  @Column()
  @ApiProperty()
  apiKey: string;

  @Column()
  @ApiProperty()
  apiEnv: string;

  @Column({ name: 'trace_id' })
  @ApiProperty()
  traceId: string;

  @CreateDateColumn()
  @ApiProperty({
    description: '创建时间戳',
  })
  timestamp: Timestamp;

  @Column({ default: '' })
  @ApiProperty({
    description: '设备信息',
  })
  device: string;

  @Column({ default: '' })
  @ApiProperty({
    description: '操作系统信息',
  })
  os: string;

  @Column({ default: '' })
  @ApiProperty({
    description: '浏览器信息',
  })
  browser: string;

  @Column({ default: '' })
  @ApiProperty({
    description: 'ip',
    default: '',
  })
  ip: string;
}
