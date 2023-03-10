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
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteEntity } from './entities/favorite.entity';

@Controller('/api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get(':userId')
  findAll(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.favoritesService.findAll(userId, { page, limit });
  }

  @Delete(':id')
  remove(@Param('id') id: FavoriteEntity['id']) {
    return this.favoritesService.remove(id);
  }
}
