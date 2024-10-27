import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';

// The AuthController is a RESTful controller that implements the auth feature.
// The @Controller() decorator defines the base route for the auth feature.
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.signIn(SignInDto);
  }
}