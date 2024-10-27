import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';

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
    await controller.signIn(signInDto);
    expect(authService.signIn).toHaveBeenCalledWith(signInDto);
  });

  it('should return the access_token from AuthService.signIn', async () => {
    const signInDto: SignInDto = { email: 'yohann@example.com', password: 'password' };
    const ExpectedResult = { access_token: 'token' };
    jest.spyOn(authService, 'signIn').mockResolvedValue(ExpectedResult);

    const result = await controller.signIn(signInDto);

    expect(result).toBe(ExpectedResult);
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
      await controller.signIn(signInDto);
    }
    catch (error) {
      expect(error).toBe(errorMessage);
    }
  });
});
