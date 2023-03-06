import { AdvertEntity } from './entities/advert.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

interface IOptionsFindAll extends IPaginationOptions {
  query: {
    title: string;
    brand: string;
    city: string;
    minYear: string;
    maxYear: string;
    minPrice: string;
    maxPrice: string;
    minKilometer: string;
    maxKilometer: string;
    exchange: string;
    armored: string;
    bodywork: string;
  };
}

@Injectable()
export class AdvertsService {
  constructor(
    @InjectRepository(AdvertEntity)
    private readonly advertsRepository: Repository<AdvertEntity>,
  ) {}

  async create(data: CreateAdvertDto) {
    const advert = this.advertsRepository.create(data);

    await this.advertsRepository.save(advert);

    return advert;
  }

  async findAll(options: IOptionsFindAll): Promise<Pagination<AdvertEntity>> {
    const queryBuilder = this.advertsRepository.createQueryBuilder();

    if (!!options.query.title) {
      queryBuilder.andWhere(`title like :title`, {
        title: `%${options.query.title}%`,
      });
    }

    if (!!options.query.brand) {
      queryBuilder.andWhere(`brand like :brand`, {
        brand: `%${options.query.brand}%`,
      });
    }

    if (!!options.query.city) {
      queryBuilder.andWhere(`city like :city`, {
        city: `%${options.query.city}%`,
      });
    }

    if (!!options.query.minYear) {
      if (
        !!options.query.maxYear &&
        Number(options.query.maxYear) > Number(options.query.minYear)
      ) {
        queryBuilder
          .andWhere('model_year <= :max', { max: options.query.maxYear })
          .andWhere('model_year >= :min', { min: options.query.minYear });
      } else {
        queryBuilder.andWhere('model_year >= :min', {
          min: options.query.minYear,
        });
      }
    }
    if (!!options.query.maxYear) {
      queryBuilder.andWhere('model_year <= :max', {
        max: options.query.maxYear,
      });
    }

    if (!!options.query.minPrice) {
      if (
        !!options.query.maxPrice &&
        Number(options.query.maxPrice) > Number(options.query.minPrice)
      ) {
        queryBuilder
          .andWhere('value <= :max', { max: options.query.maxPrice })
          .andWhere('value >= :min', { min: options.query.minPrice });
      } else {
        queryBuilder.andWhere('value >= :min', { min: options.query.minPrice });
      }
    }

    if (!!options.query.maxPrice) {
      if (
        !!options.query.minPrice &&
        Number(options.query.maxPrice) > Number(options.query.minPrice)
      ) {
        queryBuilder
          .andWhere('value <= :max', { max: options.query.maxPrice })
          .andWhere('value >= :min', { min: options.query.minPrice });
      } else {
        queryBuilder.andWhere('value <= :max', { max: options.query.maxPrice });
      }
    }

    if (!!options.query.minKilometer) {
      if (
        !!options.query.maxKilometer &&
        Number(options.query.maxKilometer) > Number(options.query.minKilometer)
      ) {
        queryBuilder
          .andWhere('kilometer <= :max', { max: options.query.maxKilometer })
          .andWhere('kilometer >= :min', { min: options.query.minKilometer });
      } else {
        queryBuilder.andWhere('kilometer >= :min', {
          min: options.query.minKilometer,
        });
      }
    }

    if (!!options.query.maxKilometer) {
      if (
        !!options.query.minKilometer &&
        Number(options.query.maxKilometer) > Number(options.query.minKilometer)
      ) {
        queryBuilder
          .andWhere('kilometer <= :max', { max: options.query.maxKilometer })
          .andWhere('kilometer >= :min', { min: options.query.minKilometer });
      } else {
        queryBuilder.andWhere('kilometer <= :max', {
          max: options.query.maxKilometer,
        });
      }
    }

    queryBuilder.getMany();

    return paginate(queryBuilder, options);
  }

  findOne(id: AdvertEntity['id']) {
    return this.advertsRepository.findOne({ where: { id } });
  }

  async views(query: { id?: string; advert?: string }) {
    try {
      const adverts = await this.advertsRepository
        .createQueryBuilder()
        .where(
          query.id
            ? `user_id = "${query.id}"`
            : query.advert
            ? `id = "${query.advert}"`
            : '',
        )
        .select(`${!query.advert ? 'SUM(views)' : 'views'}`, 'count')
        .getRawOne();

      return {
        error: false,
        count: Number(adverts.count),
      };
    } catch (err) {
      console.log(err);

      return {
        error: true,
        message: 'Failed get view',
      };
    }
  }

  async update(id: AdvertEntity['id'], data: UpdateAdvertDto) {
    const advert = await this.findOne(id);

    if (advert) {
      this.advertsRepository.merge(advert, data);
      return await this.advertsRepository.save(advert);
    }
  }

  async remove(id: AdvertEntity['id']) {
    const advert = await this.findOne(id);

    if (advert) {
      return this.advertsRepository.delete(id);
    } else {
      return new HttpException('Advert not found', 404);
    }
  }
}
