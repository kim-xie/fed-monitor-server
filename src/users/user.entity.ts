import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: 'Login name',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Login name',
  })
  password: string;

  @Column()
  @ApiProperty({
    description: 'The real name',
  })
  realName: string;

  @Column()
  @ApiProperty({
    description: 'The nick name',
  })
  nickName: string;

  @Column()
  @ApiProperty({
    description: 'The mobile number',
  })
  mobile: string;

  @Column({ default: true })
  @ApiProperty({
    description: 'Whether active or not',
    default: true,
  })
  isActive: boolean;
}
