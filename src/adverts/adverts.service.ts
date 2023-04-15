import { AdvertEntity } from './entities/advert.entity';
import { Like, Between, Repository, Not, FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { S3Service } from 'src/s3/s3.service';

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
    private readonly s3Services: S3Service,
  ) {}

  async create(data: CreateAdvertDto) {
    const advert = this.advertsRepository.create(data);

    await this.advertsRepository.save(advert);

    return advert;
  }

  async uploadFiles(files: Express.Multer.File[], id: string) {
    const advert = await this.findOne({ where: { id } });

    if (advert) {
      try {
        const keys: Array<string> = await this.s3Services.uploadFiles(files);

        await this.update(id, { images: keys });
      } catch (err) {
        throw new HttpException(err.message, 500);
      }
    } else {
      throw new HttpException('Advert not found', 400);
    }
  }

  async deleteFiles(files: string[]) {
    try {
      return await this.s3Services.deleteFiles(files);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
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

    const [items, count] = await this.advertsRepository.findAndCount({
      where: whereOptions,
      skip: +options.page > 1 ? +options.limit * (+options.page - 1) : 0,
      take: +options.limit || 20,
    });

    return {
      items,
      count,
    };
  }

  async findOne(options: FindOneOptions<AdvertEntity>) {
    return this.advertsRepository.findOne(options);
  }

  async views(query: { id?: string; advert?: string }) {
    try {
      const adverts = await this.advertsRepository
        .createQueryBuilder()
        .where(
          query.id
            ? `userId = "${query.id}"`
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
    const advert = await this.findOne({ where: { id } });

    if (advert) {
      this.advertsRepository.merge(advert, data);
      return await this.advertsRepository.save(advert);
    }
  }

  async remove(id: AdvertEntity['id']) {
    const advert = await this.findOne({ where: { id } });

    if (advert) {
      return this.advertsRepository.delete(id);
    } else {
      return new HttpException('Advert not found', 404);
    }
  }
}
