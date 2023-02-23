import { Test, TestingModule } from '@nestjs/testing';
import { AdvertsService } from './adverts.service';

describe('AdvertsService', () => {
  let service: AdvertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertsService],
    }).compile();

    service = module.get<AdvertsService>(AdvertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
