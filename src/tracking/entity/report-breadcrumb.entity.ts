import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Report } from './report.entity';

@Entity()
export class ReportBreadcrumb {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
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

  @CreateDateColumn({
    readonly: true,
    // default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: '创建时间戳',
    default: Date.now(),
  })
  time: Date;

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
