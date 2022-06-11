import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Report } from './report.entity';

@Entity()
export class ReportBreadcrumb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  type: string;

  @Column({ default: '' })
  @ApiProperty()
  category: string;

  @Column()
  @ApiProperty()
  data: string;

  @CreateDateColumn()
  @ApiProperty({
    description: '创建时间戳',
  })
  time: Timestamp;

  @Column()
  @ApiProperty({ default: '' })
  level: string;

  // @Column({
  //   name: 'report_id',
  // })
  // @ApiProperty({ default: '' })
  // reportId: number;

  @ManyToOne(() => Report, (report) => report.breadcrumb)
  report: Report;
}
