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

import { Browser } from './browser.entity';
import { Device } from './device.entity';
import { OperationSystem } from './os.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ReportBreadcrumb, (breadcrumb) => breadcrumb.report, {
    cascade: true,
  })
  @JoinColumn()
  @ApiProperty()
  breadcrumb: ReportBreadcrumb[];

  @OneToMany(() => ReportSdk, (sdk) => sdk.report, { cascade: true })
  @JoinColumn()
  @ApiProperty()
  sdk: ReportSdk[];

  @Column({ default: '' })
  @ApiProperty({
    description: 'ip',
    default: '',
  })
  ip: string;

  @Column({ default: '' })
  @ApiProperty()
  apiKey: string;

  @Column({ default: '' })
  @ApiProperty()
  apiEnv: string;

  @Column({ default: '' })
  @ApiProperty()
  traceId: string;

  @CreateDateColumn()
  @ApiProperty()
  timestamp: Timestamp;

  @OneToOne(() => ReportData)
  @JoinColumn()
  @ApiProperty()
  data: ReportData;

  @OneToOne(() => Device)
  @JoinColumn()
  @ApiProperty({
    description: '设备信息',
  })
  device: Device;

  @OneToOne(() => OperationSystem)
  @JoinColumn()
  @ApiProperty({
    description: '操作系统信息',
  })
  os: OperationSystem;

  @OneToOne(() => Browser)
  @JoinColumn()
  @ApiProperty({
    description: '浏览器信息',
  })
  browser: Browser;
}
