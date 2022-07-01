import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReportData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8 })
  @ApiProperty()
  type: string;

  @Column({ length: 255 })
  @ApiProperty()
  url: string;

  @Column({ length: 32 })
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

  @Column({ type: 'json' })
  @ApiProperty({
    description: '扩展字段',
  })
  extends: Record<string, any>;
}
