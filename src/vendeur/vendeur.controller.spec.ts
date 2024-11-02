import { Test, TestingModule } from '@nestjs/testing';
import { VendeurController } from './vendeur.controller';
import { VendeurService } from './vendeur.service';

describe('VendeurController', () => {
  let controller: VendeurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendeurController],
      providers: [VendeurService],
    }).compile();

    controller = module.get<VendeurController>(VendeurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
