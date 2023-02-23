import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdvertsService } from './adverts.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';

@Controller('adverts')
export class AdvertsController {
  constructor(private readonly advertsService: AdvertsService) {}

  @Post()
  create(@Body() createAdvertDto: CreateAdvertDto) {
    return this.advertsService.create(createAdvertDto);
  }

  @Get()
  findAll() {
    return this.advertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdvertDto: UpdateAdvertDto) {
    return this.advertsService.update(+id, updateAdvertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertsService.remove(+id);
  }
}
