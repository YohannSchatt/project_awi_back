import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user.service';
import { SignInDto } from './dto/sign-In.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const signInDto: SignInDto = { email: 'yohann@example.com', password: 'password1234' };
      const user = { idUtilisateur: 2, role: Role.Admin };
      const token = 'test-token';

      jest.spyOn(userService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.signIn(signInDto);

      expect(userService.validateUser).toHaveBeenCalledWith(signInDto.email, signInDto.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ idUtilisateur: user.idUtilisateur, role: user.role });
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signInDto: SignInDto = { email: 'shane@example.com', password: 'wrong-password' };

      jest.spyOn(userService, 'validateUser').mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
      expect(userService.validateUser).toHaveBeenCalledWith(signInDto.email, signInDto.password);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'wrong-password' };

      jest.spyOn(userService, 'validateUser').mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
      expect(userService.validateUser).toHaveBeenCalledWith(signInDto.email, signInDto.password);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
