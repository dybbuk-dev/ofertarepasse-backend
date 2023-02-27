import { AdvertEntity } from './entities/advert.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return this.advertsRepository.find();
  }

  findOne(id: AdvertEntity['id']) {
    return this.advertsRepository.findOne({ where: { id } });
  }

  update(id: AdvertEntity['id'], updateAdvertDto: UpdateAdvertDto) {
    return `This action updates a #${id} advert`;
  }

  remove(id: AdvertEntity['id']) {
    return `This action removes a #${id} advert`;
  }
}
