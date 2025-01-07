import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { Role, Utilisateur } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetPayloadDto } from './dto/get-payload.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    utilisateur: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user data when user is found', async () => {
      const mockUser = {
        prenom: 'John',
        nom: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
      };

      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result: GetUserDto = await service.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { idUtilisateur: 1 },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { idUtilisateur: 1 },
      });
    });
  });

  describe('createUser', () => {
    it('should create and return the user successfully', async () => {
      const createUserDto : CreateUserDto = {
        prenom: 'John',
        nom: 'Doe',
        email: 'John.Doe@example.com',
        role : Role.GESTIONNAIRE,
        password : 'password',
      };

      const salt = 'randomsalt';
      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const mockUser: Utilisateur = {
        idUtilisateur: 1,
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
        role: Role.GESTIONNAIRE,
        password: hashedPassword,
        // Add other properties if necessary
      };
      // Mock prisma.utilisateur.create
      (prisma.utilisateur.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, salt);
      expect(prisma.utilisateur.create).toHaveBeenCalledWith({
        data: {
          prenom: createUserDto.prenom,
          nom: createUserDto.nom,
          email: createUserDto.email,
          role: createUserDto.role,
          password: hashedPassword,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user is not created', async () => {
      const createUserDto: CreateUserDto = {
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
        role: Role.GESTIONNAIRE,
        password: 'securepassword',
      };

      const salt = 'randomsalt';
      const hashedPassword = 'hashedpassword';

      // Mock bcrypt methods
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      // Mock prisma.utilisateur.create to return null
      (prisma.utilisateur.create as jest.Mock).mockResolvedValue(null);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('User not created'),
      );
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, salt);
      expect(prisma.utilisateur.create).toHaveBeenCalledWith({
        data: {
          prenom: createUserDto.prenom,
          nom: createUserDto.nom,
          email: createUserDto.email,
          role: createUserDto.role,
          password: hashedPassword,
        },
      });
    });
  });

  describe('validateUser', () => {
    it('should return payload when user is found and password is valid', async () => {
      const email = 'jane.doe@example.com';
      const password = 'securepassword';

      const mockUser: Utilisateur = {
        idUtilisateur: 2,
        prenom: 'Jane',
        nom: 'Doe',
        email: email,
        role: Role.GESTIONNAIRE,
        password: 'hashedpassword'
      };

      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result: GetPayloadDto = await service.validateUser(email, password);

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: email },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);

      expect(result).toEqual({
        idUtilisateur: mockUser.idUtilisateur,
        role: mockUser.role,
      });
    });

    it('should throw BadRequestException when user is not found', async () => {
      const email = 'non.existent@example.com';
      const password = 'anyPassword';

      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new BadRequestException('User not found'),
      );

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: email },
      });

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const email = 'jane.doe@example.com';
      const password = 'wrongpassword';

      const mockUser: Utilisateur = {
        idUtilisateur: 2,
        prenom: 'Jane',
        nom: 'Doe',
        email: email,
        role: Role.GESTIONNAIRE,
        password: 'hashedpassword'
      };

      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: email },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });

  describe('updateUser', () => {
    it('should update the user successfully when user exists and data is valid', async () => {
      const id = 1;
      const updateUserDto: UpdateUserInfoDto = {
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
      };

      const mockUser: Utilisateur = {
        idUtilisateur: id,
        prenom: 'OldPrenom',
        nom: 'OldNom',
        email: 'old.email@example.com',
        role: Role.GESTIONNAIRE,
        password: 'hashedpassword',
      };

      const updatedUser: Utilisateur = {
        ...mockUser,
        prenom: updateUserDto.prenom,
        nom: updateUserDto.nom,
        email: updateUserDto.email,
      };

      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

      (prisma.utilisateur.update as jest.Mock).mockResolvedValue(updatedUser);

      await service.updateUser(id, updateUserDto);

      expect(prisma.utilisateur.update).toHaveBeenCalledWith({
        where: { idUtilisateur: id },
        data: {
          prenom: updateUserDto.prenom,
          nom: updateUserDto.nom,
          email: updateUserDto.email,
        },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const id = 1;
      const updateUserDto: UpdateUserInfoDto = {
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
      };

        (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(service.updateUser(id, updateUserDto)).rejects.toThrow(
          new NotFoundException(`User with ID ${id} not found`),
        );
      
        expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({
          where: { idUtilisateur: id },
        });
        expect(prisma.utilisateur.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUserWithEmail', () => {
    it('should delete the user successfully when user exists', async () => {
      const email = 'jane.doe@example.com';
      const mockUser: Utilisateur = {
        idUtilisateur: 1,
        prenom: 'Jane',
        nom: 'Doe',
        email: email,
        role: Role.GESTIONNAIRE,
        password: 'hashedpassword',
      };

      (prisma.utilisateur.delete as jest.Mock).mockResolvedValue(mockUser);

      await service.deleteUserWithEmail(email);

      // Assert
      expect(prisma.utilisateur.delete).toHaveBeenCalledWith({
        where: { email: email },
      });
    });

    it('should throw an error when user does not exist', async () => {
      const email = 'nonexistent@example.com';
      (prisma.utilisateur.delete as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUserWithEmail(email)).rejects.toThrow(
        'User not found'
      );

      expect(prisma.utilisateur.delete).toHaveBeenCalledWith({
        where: { email: email },
      });
    });

    it('should throw an error when prisma.utilisateur.delete throws an exception', async () => {
      const email = 'error@example.com';

      (prisma.utilisateur.delete as jest.Mock).mockRejectedValue(new Error('Prisma Error'));

      await expect(service.deleteUserWithEmail(email)).rejects.toThrow(
        'Prisma Error'
      );

      expect(prisma.utilisateur.delete).toHaveBeenCalledWith({
        where: { email: email },
      });
    });
  });


  describe('getGestionnaire', () => {
    it('should return a list of gestionnaire users when they exist', async () => {
      const mockGestionnaires: Utilisateur[] = [
        {
          idUtilisateur: 1,
          prenom: 'Alice',
          nom: 'Smith',
          email: 'alice.smith@example.com',
          role: Role.GESTIONNAIRE,
          password: 'hashedpassword1',
        },
        {
          idUtilisateur: 2,
          prenom: 'Bob',
          nom: 'Johnson',
          email: 'bob.johnson@example.com',
          role: Role.GESTIONNAIRE,
          password: 'hashedpassword2',
        },
      ];

      (prisma.utilisateur.findMany as jest.Mock).mockResolvedValue(mockGestionnaires);

      const result = await service.getGestionnaire();

      expect(prisma.utilisateur.findMany).toHaveBeenCalledWith({
        where: { role: Role.GESTIONNAIRE },
      });
      expect(result).toEqual(mockGestionnaires);
    });

    it('should return an empty array when no gestionnaire users exist', async () => {
      const mockGestionnaires: Utilisateur[] = [];

      (prisma.utilisateur.findMany as jest.Mock).mockResolvedValue(mockGestionnaires);

      const result = await service.getGestionnaire();

      expect(prisma.utilisateur.findMany).toHaveBeenCalledWith({
        where: { role: Role.GESTIONNAIRE },
      });
      expect(result).toEqual(mockGestionnaires);
    })

    it('should throw an error when prisma.utilisateur.findMany throws an exception', async () => {
      (prisma.utilisateur.findMany as jest.Mock).mockRejectedValue(new Error('Prisma Error'));

      await expect(service.getGestionnaire()).rejects.toThrow('Prisma Error');

      expect(prisma.utilisateur.findMany).toHaveBeenCalledWith({
        where: { role: Role.GESTIONNAIRE },
      });
    });
  });
});
