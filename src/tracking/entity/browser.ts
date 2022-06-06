import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReportSdk {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  version: string;

  @Column()
  @ApiProperty()
  remark: string;
}
