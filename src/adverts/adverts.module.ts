import { Module } from '@nestjs/common';
import { AdvertEntity } from './entities/advert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertsService } from './adverts.service';
import { AdvertsController } from './adverts.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertEntity]), S3Module],
  controllers: [AdvertsController],
  providers: [AdvertsService],
})
export class AdvertsModule {}
