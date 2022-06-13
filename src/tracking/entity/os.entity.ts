import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OperationSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  content: string;
}
