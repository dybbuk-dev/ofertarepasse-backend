import { Test, TestingModule } from '@nestjs/testing';
import { AdvertsController } from './adverts.controller';
import { AdvertsService } from './adverts.service';

describe('AdvertsController', () => {
  let controller: AdvertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertsController],
      providers: [AdvertsService],
    }).compile();

    controller = module.get<AdvertsController>(AdvertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
