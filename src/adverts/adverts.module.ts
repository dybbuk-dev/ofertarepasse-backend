import { Module } from '@nestjs/common';
import { AdvertEntity } from './entities/advert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertsService } from './adverts.service';
import { AdvertsController } from './adverts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertEntity])],
  controllers: [AdvertsController],
  providers: [AdvertsService],
})
export class AdvertsModule {}
