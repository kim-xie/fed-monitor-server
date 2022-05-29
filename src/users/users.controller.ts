import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  NotAcceptableException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RegisterUserDto } from './dto/register-user.dto';
import { UserLoginDto } from './dto/login-user.dto';

import { User } from './user.entity';
import { UsersService } from './users.service';

import { AuthService } from '../auth/auth.service';

// import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginParmas: UserLoginDto) {
    const { user, code } = await this.authService.validateUser(
      loginParmas.name,
      loginParmas.password,
    );
    switch (code) {
      case 1:
        return this.authService.certificate(user);
      case 2:
        throw new NotAcceptableException('Name or password is incorrect.');
      default:
        throw new NotFoundException('User cannot found.');
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  create(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.register(registerUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: 200,
    description: 'The found users',
    type: [User],
  })
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':name')
  @ApiOperation({ summary: 'Find user' })
  @ApiResponse({
    status: 200,
    description: 'The founded user.',
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('name') name: string): Promise<User> {
    return this.usersService.findOne(name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remove user by id' })
  @ApiResponse({
    status: 200,
    description: 'Remove user',
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
