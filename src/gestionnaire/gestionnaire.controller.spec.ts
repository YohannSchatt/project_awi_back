import { Test, TestingModule } from '@nestjs/testing';
import { GestionnaireController } from './gestionnaire.controller';
import { GestionnaireService } from './gestionnaire.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('GestionnaireController', () => {
  let controller: GestionnaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [GestionnaireController],
      providers: [GestionnaireService, JwtAuthGuard, RolesGuard],
    }).compile();

    controller = module.get<GestionnaireController>(GestionnaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return "This is a gestionnaire endpoint"', () => {
    expect(controller.gestionnaireEndpoint()).toBe('This is a gestionnaire endpoint');
  });
});
