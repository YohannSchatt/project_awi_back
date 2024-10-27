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
    if (!SignInDto.email || !SignInDto.password) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          'email should not be empty',
          'password should not be empty',
        ],
      };
    }
    if (SignInDto.email === '' || SignInDto.password === '') {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          'email should not be empty',
          'password should not be empty',
        ],
      };
    }
    try {
      return this.authService.signIn(SignInDto);
    }
    catch (error) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: error.message,
      };
    }
  }
}