import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { SignInDto } from './dto/sign-in.dto';


// The AuthService is a service that provides authentication-related functionality.
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string, idUtilisateur : number }> {
    try {
      const user = await this.userService.validateUser(signInDto.email, signInDto.password);
      const payload = { idUtilisateur : user.idUtilisateur, role : user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
        idUtilisateur : user.idUtilisateur
      };
    }
    catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async GetUserWithId(idUtilisateur : number) {
    return this.userService.getUserById(idUtilisateur);
  }
}