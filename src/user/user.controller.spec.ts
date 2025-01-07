import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user data when user is authenticated', async () => {
      const mockGetUserDto: GetUserDto = {
        prenom: 'John',
        nom: 'Doe',
        email: 'john.doe@example.com',
        role: Role.GESTIONNAIRE,
      };

      const mockRequest = {
        user: { idUtilisateur: 1 },
      } as unknown as Request;

      (service.getUserById as jest.Mock).mockResolvedValue(mockGetUserDto);

      // Act
      const result = await controller.getUser(mockRequest);

      // Assert
      expect(service.getUserById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockGetUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update the user successfully when data is valid', async () => {
      const mockUpdateUserDto: UpdateUserInfoDto = {
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
      };

      const mockRequest = {
        user: { idUtilisateur: 1 },
        body: mockUpdateUserDto,
      } as unknown as Request;

      (service.updateUser as jest.Mock).mockResolvedValue(undefined);

      await controller.updateUser(mockRequest);

      expect(service.updateUser).toHaveBeenCalledWith(1, mockUpdateUserDto);
    });

    it('should throw BadRequestException if updateUser fails', async () => {
      const mockUpdateUserDto: UpdateUserInfoDto = {
        prenom: 'Jane',
        nom: 'Doe',
        email: 'jane.doe@example.com',
      };

      const mockRequest = {
        user: { idUtilisateur: 1 },
        body: mockUpdateUserDto,
      } as unknown as Request;

      (service.updateUser as jest.Mock).mockRejectedValue(new BadRequestException('Missing data'));

      // Act & Assert
      await expect(controller.updateUser(mockRequest)).rejects.toThrow(BadRequestException);

      expect(service.updateUser).toHaveBeenCalledWith(1, mockUpdateUserDto);
    });
  });

  
});