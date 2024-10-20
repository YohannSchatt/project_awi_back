import { Test, TestingModule } from '@nestjs/testing';
import { GestionnaireController } from './gestionnaire.controller';

describe('GestionnaireController', () => {
  let controller: GestionnaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestionnaireController],
    }).compile();

    controller = module.get<GestionnaireController>(GestionnaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
