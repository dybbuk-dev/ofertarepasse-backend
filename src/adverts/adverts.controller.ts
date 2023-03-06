import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdvertsService } from './adverts.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { AdvertEntity } from './entities/advert.entity';

@Controller('/api/v1/adverts')
export class AdvertsController {
  constructor(private readonly advertsService: AdvertsService) {}

  @Post()
  create(@Body() createAdvertDto: CreateAdvertDto) {
    return this.advertsService.create(createAdvertDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.advertsService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: AdvertEntity['id']) {
    return this.advertsService.findOne(id);
  }

  @Post('/views')
  views(@Query() query: { id?: string; advert?: string }) {
    return this.advertsService.views(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: AdvertEntity['id'],
    @Body() updateAdvertDto: UpdateAdvertDto,
  ) {
    return this.advertsService.update(id, updateAdvertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: AdvertEntity['id']) {
    return this.advertsService.remove(id);
  }
}
