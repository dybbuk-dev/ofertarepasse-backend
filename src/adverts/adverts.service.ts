import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';

@Injectable()
export class AdvertsService {
  create(createAdvertDto: CreateAdvertDto) {
    return 'This action adds a new advert';
  }

  findAll() {
    return `This action returns all adverts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advert`;
  }

  update(id: number, updateAdvertDto: UpdateAdvertDto) {
    return `This action updates a #${id} advert`;
  }

  remove(id: number) {
    return `This action removes a #${id} advert`;
  }
}
