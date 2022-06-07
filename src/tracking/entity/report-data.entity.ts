import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReportData {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column()
  @ApiProperty()
  type: string;

  @Column()
  @ApiProperty()
  url: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  category: string;

  @Column()
  @ApiProperty()
  level: string;

  @Column()
  @ApiProperty({
    description: '扩展字段',
  })
  extends: string;
}
