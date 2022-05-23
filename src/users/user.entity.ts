import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: 'The first name',
  })
  firstName: string;

  @Column()
  @ApiProperty({
    description: 'The first name',
  })
  lastName: string;

  @Column({ default: true })
  @ApiProperty({
    description: 'Whether active or not',
    default: true,
  })
  isActive: boolean;
}
