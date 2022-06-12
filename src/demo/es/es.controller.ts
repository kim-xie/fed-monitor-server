import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { EsDemoService } from './es.service';

@ApiBearerAuth()
@ApiTags('es')
@Controller('es')
export class EsDemoController {
  constructor(private readonly esDemoService: EsDemoService) {}

  @Get('add')
  @ApiOperation({ summary: 'add' })
  @HttpCode(HttpStatus.OK)
  async add() {
    const result = await this.esDemoService.add();
    console.log('add result:', result);
    return result;
  }

  @Get('delete')
  @ApiOperation({ summary: 'delete' })
  @HttpCode(HttpStatus.OK)
  async delete() {
    const result = await this.esDemoService.delete();
    console.log('delete result:', result);
    return result;
  }

  @Get('update')
  @ApiOperation({ summary: 'update' })
  @HttpCode(HttpStatus.OK)
  async update() {
    const result = await this.esDemoService.update();
    console.log('update result:', result);
    return result;
  }

  @Get('search')
  @ApiOperation({ summary: 'search' })
  @HttpCode(HttpStatus.OK)
  async search() {
    const result = await this.esDemoService.search();
    console.log('search result:', result);
    return result;
  }

  @Get('count')
  @ApiOperation({ summary: 'count' })
  @HttpCode(HttpStatus.OK)
  async count() {
    const result = await this.esDemoService.count();
    console.log('count result:', result);
    return result;
  }
}
