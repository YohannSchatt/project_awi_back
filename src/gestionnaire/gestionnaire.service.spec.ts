import { Test, TestingModule } from '@nestjs/testing';
import { GestionnaireService } from './gestionnaire.service';

describe('GestionnaireService', () => {
  let service: GestionnaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestionnaireService],
    }).compile();

    service = module.get<GestionnaireService>(GestionnaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
