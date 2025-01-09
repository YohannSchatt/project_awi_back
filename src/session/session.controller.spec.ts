import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  const mockSessionService = {
    getNextSession: jest.fn(),
    getActualSession: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSession', () => {
    it('should return the next upcoming sessions', async () => {
      const mockSessions = [
        {
          id: 3,
          titre: 'Next Session 1',
          lieu: 'Room A',
          dateDebut: new Date('2024-01-10T09:00:00Z'),
          dateFin: new Date('2024-01-10T17:00:00Z'),
          description: 'First upcoming session.',
          comission: 1500,
        },
        {
          id: 4,
          titre: 'Next Session 2',
          lieu: 'Room B',
          dateDebut: new Date('2024-02-15T10:00:00Z'),
          dateFin: new Date('2024-02-15T18:00:00Z'),
          description: 'Second upcoming session.',
          comission: 1800,
        },
      ];

      (service.getNextSession as jest.Mock).mockResolvedValue(mockSessions);

      const result = await controller.getSession();

      expect(service.getNextSession).toHaveBeenCalled();
      expect(result).toEqual(mockSessions);
    });

    it('should throw an error when service.getNextSession throws an exception', async () => {
      const errorMessage = 'Prisma error';
      (service.getNextSession as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(controller.getSession()).rejects.toThrow(errorMessage);
      expect(service.getNextSession).toHaveBeenCalled();
    });
  });

  describe('getActualSession', () => {
    it('devrait retourner la session actuelle', async () => {
      const mockSession = {
        idSession: 1,
        name: 'Session Actuelle',
        startDate: new Date(),
        endDate: new Date(),
        description: 'Session actuelle en cours',
        comission: new Decimal(1500),
      };

      (service.getActualSession as jest.Mock).mockResolvedValue(mockSession);

      expect(await controller.getActualSession()).toBe(mockSession);
      expect(service.getActualSession).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs correctement', async () => {
      jest.spyOn(service, 'getActualSession').mockRejectedValue(new Error('Erreur lors de la récupération de la session'));

      await expect(controller.getActualSession()).rejects.toThrow('Erreur lors de la récupération de la session');
      expect(service.getActualSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle session et retourner le résultat', async () => {
      const createSessionDto: CreateSessionDto = {
        titre: 'Nouvelle Session',
        dateDebut: "2023-01-01",
        dateFin: "2023-12-31",
        lieu: 'montpellier',
        description: 'ergjkerjg',
        comission: 0
      };

      const mockResult = {
        id: 1,
        ...createSessionDto,
      };

      (service.create as jest.Mock).mockResolvedValue(mockResult);

      expect(await controller.create(createSessionDto, {} as any)).toBe(mockResult);
      expect(service.create).toHaveBeenCalledWith(createSessionDto);
    });

    it('devrait lancer une erreur si la création échoue', async () => {
      const createSessionDto: CreateSessionDto = {
        titre: 'Nouvelle Session',
        dateDebut: "2023-01-01",
        dateFin: "2023-12-31",
        lieu: 'montpellier',
        description: 'ergjkerjg',
        comission: 0
      };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Erreur de création'));

      await expect(controller.create(createSessionDto, {} as any)).rejects.toThrow('Erreur de création');
      expect(service.create).toHaveBeenCalledWith(createSessionDto);
    });
    it('devrait gérer les erreurs spécifiques de validation', async () => {
      const createSessionDto: CreateSessionDto = {
        titre: '',
        dateDebut: "2023-01-01",
        dateFin: "2023-12-31",
        lieu: 'montpellier',
        description: 'ergjkerjg',
        comission: 0
      };

      jest.spyOn(service, 'create').mockRejectedValue({
        message: 'Le nom de la session ne peut pas être vide',
        status: 400,
      });

      await expect(controller.create(createSessionDto, {} as any)).rejects.toMatchObject({
        message: 'Le nom de la session ne peut pas être vide',
        status: 400,
      });
      expect(service.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une session et retourner le résultat', async () => {
      const updateSessionDto: UpdateSessionDto = {
        id: 1,
        titre: 'Session Mise à Jour',
        dateDebut: '2023-02-01',
        dateFin: '2023-12-31',
      };

      const mockResult = {
        id: 1,
        ...updateSessionDto,
      };

      (service.update as jest.Mock).mockResolvedValue(mockResult);

      expect(await controller.update(updateSessionDto, {} as any)).toBe(mockResult);
      expect(service.update).toHaveBeenCalledWith(updateSessionDto);
    });

    it('devrait lancer une erreur si la mise à jour échoue', async () => {
      const updateSessionDto: UpdateSessionDto = {
        id: 1,
        titre: 'Session Mise à Jour',
        dateDebut: '2023-02-01',
        dateFin: '2023-12-31',
      };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Erreur de mise à jour'));

      await expect(controller.update(updateSessionDto, {} as any)).rejects.toThrow('Erreur de mise à jour');
      expect(service.update).toHaveBeenCalledWith(updateSessionDto);
    });
  });

  describe('delete', () => {
    it('devrait supprimer une session et retourner le résultat', async () => {
      const body = { id: 1 };
      const mockResult = { success: true };

      (service.delete as jest.Mock).mockResolvedValue(mockResult);

      expect(await controller.delete(body, {} as any)).toBe(mockResult);
      expect(service.delete).toHaveBeenCalledWith(body.id);
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      const body = { id: 1 };
      const mockError = new Error('Erreur de suppression');

      jest.spyOn(service, 'delete').mockRejectedValue(mockError);

      await expect(controller.delete(body, {} as any)).rejects.toThrow('Erreur de suppression');
      expect(service.delete).toHaveBeenCalledWith(body.id);
    });
  });
});