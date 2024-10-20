import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Payload } from 'src/common/interface/payload.interface';


// The AuthService is a service that provides authentication-related functionality.
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload : Payload = { userId: user.userId, username: user.username, role : user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}