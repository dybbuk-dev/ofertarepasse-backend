import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdvertsService } from './adverts.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { AdvertEntity } from './entities/advert.entity';

@Controller('/api/v1/adverts')
export class AdvertsController {
  constructor(private readonly advertsService: AdvertsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAdvertDto: CreateAdvertDto) {
    return this.advertsService.create(createAdvertDto);
  }

  @Get()
  findAll(@Query('page') page, @Query('limit') limit = 20, @Query() query) {
    return this.advertsService.findAll({ page, limit, query });
  }

  @Get(':id')
  findOne(@Param('id') id: AdvertEntity['id']) {
    return this.advertsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/views')
  views(@Query() query: { id?: string; advert?: string }) {
    return this.advertsService.views(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: AdvertEntity['id'],
    @Body() updateAdvertDto: UpdateAdvertDto,
  ) {
    return this.advertsService.update(id, updateAdvertDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: AdvertEntity['id']) {
    return this.advertsService.remove(id);
  }
}
