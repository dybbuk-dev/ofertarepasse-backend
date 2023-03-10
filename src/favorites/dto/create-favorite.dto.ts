import { IsNotEmpty } from 'class-validator';
import { FavoriteEntity } from '../entities/favorite.entity';

export class CreateFavoriteDto {
  @IsNotEmpty()
  user: FavoriteEntity['user'];

  @IsNotEmpty()
  advert: FavoriteEntity['advert'];
}
