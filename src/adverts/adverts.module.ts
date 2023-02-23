import { Module } from '@nestjs/common';
import { AdvertsService } from './adverts.service';
import { AdvertsController } from './adverts.controller';

@Module({
  controllers: [AdvertsController],
  providers: [AdvertsService]
})
export class AdvertsModule {}
