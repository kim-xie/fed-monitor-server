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

  @Column({ type: 'json' })
  @ApiProperty()
  data: string | Record<string, any>;

  @CreateDateColumn()
  @ApiProperty()
  timestamp: Timestamp;

  @Column()
  @ApiProperty({ default: '' })
  level: string;

  // @Column({
  //   name: 'report_id',
  // })
  // @ApiProperty({ default: '' })
  // reportId: number;

  @ManyToOne(
    () => Report,
    (report) => report.breadcrumb,
    // { cascade: true },
  )
  report: Report;
}
