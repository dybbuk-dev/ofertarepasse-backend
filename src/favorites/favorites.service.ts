import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteEntity } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  create(data: CreateFavoriteDto) {
    const favorite = this.favoriteRepository.create(data);
    return this.favoriteRepository.save(favorite);
  }

  async findAll(userId: string, options: IPaginationOptions) {
    const queryBuilder = this.favoriteRepository.createQueryBuilder('favorite');

    await queryBuilder
      .where('favorite.userId = :userId', { userId })
      .leftJoinAndSelect('favorite.advert', 'advert')
      .getMany();

    return paginate(queryBuilder, options);
  }

  remove(id: FavoriteEntity['id']) {
    return this.favoriteRepository.delete({ id });
  }
}
