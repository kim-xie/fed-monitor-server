import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from './report.entity';

@Entity()
export class ReportSdk {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ default: '' })
  @ApiProperty()
  name: string;

  @Column({ default: '' })
  @ApiProperty()
  version: string;

  @ManyToOne(() => Report, (report) => report.breadcrumb)
  report: Report;
}
