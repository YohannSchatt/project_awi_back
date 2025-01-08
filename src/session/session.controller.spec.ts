import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { NotFoundException } from '@nestjs/common';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  const mockSessionService = {
    getNextSession: jest.fn(),
    getActualSession: jest.fn(),
    create: jest.fn(),
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


});