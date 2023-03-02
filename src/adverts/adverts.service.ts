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

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<AdvertEntity>> {
    const queryBuilder = this.advertsRepository.createQueryBuilder();

    return paginate(queryBuilder, options);
  }

  findOne(id: AdvertEntity['id']) {
    return this.advertsRepository.findOne({ where: { id } });
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
