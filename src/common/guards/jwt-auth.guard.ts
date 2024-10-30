import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//The JwtAuthGuard class extends the AuthGuard class from the @nestjs/passport package.
//The canActivate() method calls the super.canActivate() method to check if the user is authenticated.
//The handleRequest() method is called when the user is not authenticated. 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}