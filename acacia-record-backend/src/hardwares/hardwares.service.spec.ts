import { Test, TestingModule } from '@nestjs/testing';
import { HardwaresService } from './hardwares.service';

describe('HardwaresService', () => {
  let service: HardwaresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HardwaresService],
    }).compile();

    service = module.get<HardwaresService>(HardwaresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
