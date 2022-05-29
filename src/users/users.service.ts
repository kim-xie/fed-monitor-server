import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterUserDto } from './dto/register-user.dto';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    if (
      await this.usersRepository.findOne({
        where: { name: registerUserDto.name },
      })
    ) {
      throw new NotAcceptableException('User already created.');
    }
    if (registerUserDto.password !== registerUserDto.confirmPassword) {
      throw new NotAcceptableException('Password do not match.');
    }
    const user = new User();
    user.name = registerUserDto.name;
    user.mobile = registerUserDto.mobile;
    user.realName = registerUserDto.realName;
    user.nickName = registerUserDto.nickName;
    user.password = registerUserDto.password;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(name: string): Promise<User> {
    return this.usersRepository.findOne({ where: { name } });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
