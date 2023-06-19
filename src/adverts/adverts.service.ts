import { AdvertEntity } from './entities/advert.entity';
import { Like, Between, Repository, Not, FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { S3Service } from 'src/s3/s3.service';
import { ResearchesService } from 'src/researches/researches.service';

interface IOptionsFindAll extends IPaginationOptions {
  query: {
    userId: string;
    seller: string;
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
    vehicleType: string;
    options: string;
    fuel: string;
    finalPlate: string;
    colors: string;
    highlight: string;
    withPhoto: string;
  };
}

@Injectable()
export class AdvertsService {
  constructor(
    @InjectRepository(AdvertEntity)
    private readonly advertsRepository: Repository<AdvertEntity>,
    private readonly s3Services: S3Service,
    private readonly researchesServices: ResearchesService,
  ) {}

  async create(data: CreateAdvertDto) {
    const advert = this.advertsRepository.create(data);

    await this.researchesServices.create({ text: data.title, access: 0 });

    await this.advertsRepository.save(advert);

    return advert;
  }

  async uploadFiles(files: Express.Multer.File[], id: string) {
    const advert = await this.findOne({ where: { id } });

    if (advert) {
      try {
        let images = [];
        if (advert.images) {
          images = [...advert.images];
        }

        const keys: Array<string> = await this.s3Services.uploadFiles(files);

        await this.update(id, { images: [...images, ...keys] });
      } catch (err) {
        throw new HttpException(err.message, 500);
      }
    } else {
      throw new HttpException('Advert not found', 400);
    }
  }

  async deleteFiles(id: string, files: string[]) {
    try {
      const advert = await this.findOne({ where: { id } });

      if (advert) {
        await this.s3Services.deleteFiles(files);

        const newArray = [];

        for (const item of advert.images) {
          if (!files.includes(item)) {
            newArray.push(item);
          }
        }

        return this.update(id, { images: newArray });
      } else {
        throw new HttpException('Error on get advert', 404);
      }
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async findAll(options: IOptionsFindAll): Promise<any> {
    const queries = options.query;

    const whereOptions: any = {
      active: true,
    };
    if (queries.userId) {
      whereOptions.user = Like(`%${queries.userId}%`);
    }
    if (queries.title) {
      whereOptions.title = Like(`%${queries.title}%`);
    }
    if (queries.minPrice || queries.maxPrice) {
      whereOptions.value = Between(
        queries.minPrice ? queries.minPrice : 0,
        queries.maxPrice ? queries.maxPrice : 100000,
      );
    }
    if (queries.brand) {
      whereOptions.brand = Like(`%${queries.brand}%`);
    }
    if (queries.city) {
      whereOptions.city = Like(`%${queries.city}%`);
    }
    if (queries.minYear || queries.maxYear) {
      whereOptions.modelYear = Between(
        queries.minYear ? queries.minYear : 1980,
        queries.maxYear ? queries.maxYear : 2023,
      );
    }
    if (queries.minKilometer || queries.maxKilometer) {
      whereOptions.kilometer = Between(
        queries.minKilometer ? queries.minKilometer : 0,
        queries.maxKilometer ? queries.maxKilometer : 150000,
      );
    }
    if (queries.vehicleType) {
      whereOptions.vehicleType = Like(`%${queries.vehicleType}%`);
    }
    if (queries.exchange) {
      whereOptions.exchange = Like(`%${queries.exchange}%`);
    }
    if (queries.armored) {
      whereOptions.armored = Like(`%${queries.armored}%`);
    }
    if (queries.bodywork) {
      whereOptions.bodywork = Like(`%${queries.bodywork}%`);
    }
    if (queries.fuel) {
      whereOptions.fuel = Like(`%${queries.fuel}%`);
    }
    if (queries.colors) {
      whereOptions.color = Like(`%${queries.colors}%`);
    }
    if (queries.withPhoto === 'true') {
      whereOptions.images = Not('');
    }
    if (queries.seller) whereOptions.user = { type: queries.seller };

    let whereOption;

    if (queries.finalPlate) {
      whereOption = queries.finalPlate.split(' e ').map((st) => {
        return { ...whereOptions, plate: Like(`%${st}`) };
      });
    } else {
      whereOption = whereOptions;
    }

    const [items, count] = await this.advertsRepository.findAndCount({
      where: whereOption,
      skip: +options.page > 1 ? +options.limit * (+options.page - 1) : 0,
      take: +options.limit || 20,
      relations: ['user'],
    });

    return {
      items: items.filter(
        ({ options, highlight }) =>
          (queries.options ? options?.includes(queries.options) : true) &&
          (queries.highlight ? highlight?.includes(queries.highlight) : true),
      ),
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

  async recommendation() {
    try {
      return this.advertsRepository
        .createQueryBuilder('adverts')
        .select()
        .where('adverts.active = true')
        .orderBy('RAND()')
        .limit(5)
        .getMany();
    } catch (err) {
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
