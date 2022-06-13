import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Browser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  content: string;
}
