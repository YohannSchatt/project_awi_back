import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session, Role } from '@prisma/client';
import Decimal from 'decimal.js';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SearchSessionDto } from './dto/search-session.dto';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a session successfully when data is valid', async () => {
      const createSessionDto: CreateSessionDto = {
        titre: 'Session Title',
        lieu: 'Location',
        dateDebut: '2026-10-01T10:00:00Z',
        dateFin: '2026-10-02T18:00:00Z',
        description: 'Session Description',
        comission: 10,
      };

      const mockSession: Session = {
        idSession: 1,
        titre: createSessionDto.titre,
        lieu: createSessionDto.lieu,
        dateDebut: new Date(createSessionDto.dateDebut),
        dateFin: new Date(createSessionDto.dateFin),
        description: createSessionDto.description,
        comission: new Decimal(createSessionDto.comission),
      };

      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.create(createSessionDto);

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          titre: createSessionDto.titre,
          lieu: createSessionDto.lieu,
          dateDebut: new Date(createSessionDto.dateDebut),
          dateFin: new Date(createSessionDto.dateFin),
          description: createSessionDto.description,
          comission: createSessionDto.comission,
        },
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw BadRequestException when dates are invalid', async () => {
      const createSessionDto: CreateSessionDto = {
        titre: 'Session Title',
        lieu: 'Location',
        dateDebut: '2023-10-02T10:00:00Z',
        dateFin: '2023-10-01T18:00:00Z', 
        description: 'Session Description',
        comission: 1000,
      };

      await expect(service.create(createSessionDto)).rejects.toThrow(
        new BadRequestException('Les dates de la session sont incorrectes'),
      );

      expect(prisma.session.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a session successfully when data is valid', async () => {
      const updateSessionDto: UpdateSessionDto = {
        id: 1,
        titre: 'Updated Title',
        lieu: 'Updated Location',
        dateDebut: '2026-10-02T10:00:00Z',
        dateFin: '2026-10-03T18:00:00Z',
        description: 'Updated Description',
        comission: 1500,
      };

      const mockUpdatedSession: Session = {
        idSession: updateSessionDto.id,
        titre: updateSessionDto.titre,
        lieu: updateSessionDto.lieu,
        dateDebut: new Date(updateSessionDto.dateDebut),
        dateFin: new Date(updateSessionDto.dateFin),
        description: updateSessionDto.description,
        comission: new Decimal(updateSessionDto.comission),
      };

      (prisma.session.update as jest.Mock).mockResolvedValue(mockUpdatedSession);

      const result = await service.update(updateSessionDto);

      expect(result).toEqual(mockUpdatedSession);
    });

    it('should throw BadRequestException when dates are invalid', async () => {
      const updateSessionDto: UpdateSessionDto = {
        id: 1,
        titre: 'Session Title',
        lieu: 'Location',
        dateDebut: '2023-10-03T10:00:00Z',
        dateFin: '2023-10-02T18:00:00Z',
        description: 'Session Description',
        comission: 1000,
      };

      await expect(service.update(updateSessionDto)).rejects.toThrow(
        new BadRequestException('Les dates de la session sont incorrectes'),
      );

      expect(prisma.session.update).not.toHaveBeenCalled();
    });
  });

  describe('getActualSession', () => {
    it('should return the current active session when one exists', async () => {
      // Arrange
      const mockSession: Session = {
        idSession: 2,
        titre: 'Active Session',
        lieu: 'Conference Hall',
        dateDebut: new Date('2026-09-01T09:00:00Z'),
        dateFin: new Date('2026-12-31T17:00:00Z'),
        description: 'This is an active session.',
        comission: new Decimal(2000),
      };

      (prisma.session.findFirst as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.getActualSession();
      expect(result).toEqual(mockSession);
    });

    it('should return null when no active session exists', async () => {
      (prisma.session.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getActualSession();
      expect(result).toBeNull();
    })
  });

  describe('getNextSession', () => {
    it('should return the next upcoming sessions when they exist', async () => {
      const mockSessions: Session[] = [
        {
          idSession: 3,
          titre: 'Next Session 1',
          lieu: 'Room A',
          dateDebut: new Date('2026-01-10T09:00:00Z'),
          dateFin: new Date('2026-01-10T17:00:00Z'),
          description: 'First upcoming session.',
          comission: new Decimal(1500),
        },
        {
          idSession: 4,
          titre: 'Next Session 2',
          lieu: 'Room B',
          dateDebut: new Date('2026-02-15T10:00:00Z'),
          dateFin: new Date('2026-02-15T18:00:00Z'),
          description: 'Second upcoming session.',
          comission: new Decimal(1500),
        },
      ];

      (prisma.session.findMany as jest.Mock).mockResolvedValue(mockSessions);

      const result = await service.getNextSession();
      expect(result).toEqual(mockSessions);
    });

    it('should return an empty array when no upcoming sessions exist', async () => {
      (prisma.session.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getNextSession();

      expect(result).toEqual([]);
    });
  });

  describe('getListSession', () => {
    it('should return sessions matching all search criteria', async () => {
      const searchSessionDto: SearchSessionDto = {
        titre: 'Session Title',
        lieu: 'Location',
        dateDebut: '2023-10-01',
        dateFin: '2023-10-31',
      };

      const mockSessions: Session[] = [
        {
          idSession: 5,
          titre: 'Session Title',
          lieu: 'Location',
          dateDebut: new Date('2023-10-10T09:00:00Z'),
          dateFin: new Date('2023-10-10T17:00:00Z'),
          description: 'Matching session.',
          comission: new Decimal(1200),
        },
      ];

      (prisma.session.findMany as jest.Mock).mockResolvedValue(mockSessions);

      const result = await service.getListSession(searchSessionDto);
      expect(result).toEqual(mockSessions);
    });

    it('should return sessions matching partial search criteria', async () => {
      const searchSessionDto: SearchSessionDto = {
        titre: 'Session Title',
        dateDebut: '2023-10-01',
      };

      const mockSessions: Session[] = [
        {
          idSession: 6,
          titre: 'Session Title',
          lieu: 'Different Location',
          dateDebut: new Date('2023-10-15T09:00:00Z'),
          dateFin: new Date('2023-10-15T17:00:00Z'),
          description: 'Matching session with partial criteria.',
          comission: new Decimal(1300),
        },
      ];

      (prisma.session.findMany as jest.Mock).mockResolvedValue(mockSessions);

      const result = await service.getListSession(searchSessionDto);
      expect(result).toEqual(mockSessions);
    });

    it('should handle undefined search criteria by using current date for Debut and Fin', async () => {
      const searchSessionDto: SearchSessionDto = {};

      const mockSessions: Session[] = [
        {
          idSession: 7,
          titre: 'Any Title',
          lieu: 'Any Location',
          dateDebut: new Date(),
          dateFin: new Date(),
          description: 'Session with default date range.',
          comission: new Decimal(1400),
        },
      ];

      (prisma.session.findMany as jest.Mock).mockResolvedValue(mockSessions);

      const result = await service.getListSession(searchSessionDto);
      expect(result).toEqual(mockSessions);
    });
  });

  describe('delete', () => {
    it('should delete a session successfully when the session exists', async () => {
      const sessionId = 1;
      const mockSession: Session = {
        idSession: sessionId,
        titre: 'Session Title',
        lieu: 'Location',
        dateDebut: new Date('2023-10-01T10:00:00Z'),
        dateFin: new Date('2023-10-02T18:00:00Z'),
        description: 'Session Description',
        comission:  new Decimal(1000),
      };
  
      (prisma.session.delete as jest.Mock).mockResolvedValue(mockSession);
  
      const result = await service.delete(sessionId);
  
      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: {
          idSession: sessionId,
        },
      });
      expect(result).toEqual(mockSession);
    });
  
    it('should throw NotFoundException when the session does not exist', async () => {
      const sessionId = 999;
      (prisma.session.delete as jest.Mock).mockResolvedValue(null);
  
      await expect(service.delete(sessionId)).rejects.toThrow(NotFoundException);
      
      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: {
          idSession: sessionId,
        },
      });
    });
  
    it('should throw an error when prisma.session.delete throws an exception', async () => {
      const sessionId = 1;
      (prisma.session.delete as jest.Mock).mockRejectedValue(new Error('Prisma error'));
  
      await expect(service.delete(sessionId)).rejects.toThrow('Prisma error');
  
      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: {
          idSession: sessionId,
        },
      });
    });
  });
});