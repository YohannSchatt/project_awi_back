import { Test, TestingModule } from '@nestjs/testing';
import { VendeurService } from './vendeur.service';

describe('VendeurService', () => {
  let service: VendeurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendeurService],
    }).compile();

    service = module.get<VendeurService>(VendeurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
