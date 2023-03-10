import { UserEntity } from './../../users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdvertEntity } from 'src/adverts/entities/advert.entity';

@Entity('favorites')
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AdvertEntity, (advert) => advert.favorites)
  advert: AdvertEntity;

  @ManyToOne(() => UserEntity, (user) => user.favorites)
  user: UserEntity;
}
