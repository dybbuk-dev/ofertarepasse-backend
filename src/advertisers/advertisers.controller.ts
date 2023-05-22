import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdvertisersService } from './advertisers.service';

@Controller('/api/v1/advertisers')
export class AdvertisersController {
  constructor(private readonly advertisersService: AdvertisersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
  ) {
    return this.advertisersService.findAll({ limit, page }, search);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisersService.remove(id);
  }
}
