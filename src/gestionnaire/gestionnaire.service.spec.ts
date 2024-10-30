import { Test, TestingModule } from '@nestjs/testing';
import { GestionnaireService } from './gestionnaire.service';
import { GestionnaireController } from './gestionnaire.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('GestionnaireService', () => {
  let service: GestionnaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [GestionnaireController],
      providers: [GestionnaireService, JwtAuthGuard, RolesGuard],
    }).compile();

    service = module.get<GestionnaireService>(GestionnaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
