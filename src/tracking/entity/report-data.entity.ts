import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReportData {
  @PrimaryGeneratedColumn()
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

  @Column({
    type: 'varchar',
    length: 12,
  })
  @ApiProperty()
  category: string;

  @Column({
    type: 'varchar',
    length: 8,
  })
  @ApiProperty()
  level: string;

  @Column()
  @ApiProperty({
    description: '扩展字段',
  })
  extends: string;
}
