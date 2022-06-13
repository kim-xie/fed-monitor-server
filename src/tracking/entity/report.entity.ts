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
  @ApiProperty()
  breadcrumb: ReportBreadcrumb[];

  @OneToMany(() => ReportSdk, (sdk) => sdk.report, { cascade: true })
  @ApiProperty()
  sdk: ReportSdk[];

  @Column({ default: '', length: 16 })
  @ApiProperty({ description: 'ip' })
  ip: string;

  @Column({ default: '', length: 64 })
  @ApiProperty()
  apiKey: string;

  @Column({ default: '', length: 16 })
  @ApiProperty()
  apiEnv: string;

  @Column({ default: '', length: 64 })
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
  // @Column({ name: 'device_id' })
  @ApiProperty({ description: '设备信息' })
  device: Device;

  @OneToOne(() => OperationSystem)
  @JoinColumn()
  // @Column({ name: 'os_id' })
  @ApiProperty({ description: '操作系统信息' })
  os: OperationSystem;

  @OneToOne(() => Browser)
  @JoinColumn()
  // @Column({ name: 'browser_id' })
  @ApiProperty({ description: '浏览器信息' })
  browser: Browser;
}
