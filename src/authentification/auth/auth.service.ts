import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { SignInDto } from './dto/sign-In.dto';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { TokenValidationMiddleware } from 'src/common/Middleware/InvalidateToken';


// The AuthService is a service that provides authentication-related functionality.
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private invalidatedTokens: Set<string> = new Set();

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

  async verify(id : number) : Promise<{user : GetUserDto}> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {user : user};
  }

  async invalidateToken(token: string) {
    // Ajouter le token à la liste des tokens invalidés
    this.invalidatedTokens.add(token);
  }

  async isTokenValid(token: string): Promise<boolean> {
    // Vérifier si le token est dans la liste des tokens invalidés
    return !this.invalidatedTokens.has(token);
  }
}