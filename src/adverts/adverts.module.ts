import { AdvertEntity } from './entities/advert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdvertsService } from './adverts.service';
import { AdvertsController } from './adverts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertEntity])],
  controllers: [AdvertsController],
  providers: [AdvertsService],
})
export class AdvertsModule {}
