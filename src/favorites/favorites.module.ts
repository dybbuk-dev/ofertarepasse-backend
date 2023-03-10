import { FavoriteEntity } from './entities/favorite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
