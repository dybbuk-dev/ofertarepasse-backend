import { AdvertEntity } from './entities/advert.entity';
import { Like, Between, Repository, Not } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

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

  async findAll(options: IOptionsFindAll): Promise<any> {
    const queries = options.query;

    const whereOptions = {
      title: queries.title ? Like(`%${queries.title}%`) : Not(''),
      value:
        queries.minPrice || queries.maxPrice
          ? Between(
              queries.minPrice ? queries.minPrice : 0,
              queries.maxPrice ? queries.maxPrice : 100000,
            )
          : Not(''),
      brand: queries.brand ? Like(`%${queries.brand}%`) : Not(''),
      city: queries.city ? Like(`%${queries.city}%`) : Not(''),
      modelYear:
        queries.minYear || queries.maxYear
          ? Between(
              queries.minYear ? queries.minYear : 1980,
              queries.maxYear ? queries.maxYear : 2023,
            )
          : Not(''),
      kilometer:
        queries.minKilometer || queries.maxKilometer
          ? Between(
              queries.minKilometer ? queries.minKilometer : 0,
              queries.maxKilometer ? queries.maxKilometer : 150000,
            )
          : Not(''),
    };

    const adverts = await this.advertsRepository.findAndCount({
      where: whereOptions,
      skip: +options.page > 1 ? +options.limit * (+options.page - 1) : 0,
      take: +options.limit || 20,
    });

    return adverts;
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
