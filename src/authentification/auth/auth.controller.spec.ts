import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.signIn with correct parameters', async () => {
    const signInDto: SignInDto = { email: 'test', password: 'test' };
    await controller.signIn(signInDto, res);
    expect(authService.signIn).toHaveBeenCalledWith(signInDto);
  });

  it('(Test non finalisé) should send the access_token in a cookie httpOnly and return a json with message from AuthService.signIn', async () => {
    const signInDto: SignInDto = { email: 'yohann@example.com', password: 'password' };
    const ExpectedResultService = { access_token : 'token' };
    const ExpectedResult = {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
    };
    jest.spyOn(authService, 'signIn').mockResolvedValue(ExpectedResultService);

    const res: Partial<Response> = {
    cookie : jest.fn(),
    status : jest.fn().mockReturnThis(),
    json : jest.fn().mockReturnThis(),
    };
    await controller.signIn(signInDto,res);
    
    expect(res.cookie).toHaveBeenCalledWith('Authorization', expect.stringMatching(/^Bearer\s.+$/), { httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(ExpectedResult);
  });

  it('should return the error from AuthService.signIn', async () => {
    const signInDto : SignInDto = { email: 'yohann@example.com', password: 'wrong password' };
    const errorMessage = {
      message: "Invalid credentials",
      error: "Unauthorized",
      statusCode: 401
    };
    jest.spyOn(authService, 'signIn').mockRejectedValue(errorMessage);

    try {
      await controller.signIn(signInDto,res);
    }
    catch (error) {
      expect(error).toBe(errorMessage);
    }
  });
});
