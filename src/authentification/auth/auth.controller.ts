import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';

// The AuthController is a RESTful controller that implements the auth feature.
// The @Controller() decorator defines the base route for the auth feature.
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() SignInDto: SignInDto, @Res() res) {
    if (!SignInDto.email || !SignInDto.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          'email should not be empty',
          'password should not be empty',
        ],
      });
    }
    if (SignInDto.email === '' || SignInDto.password === '') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          'email should not be empty',
          'password should not be empty',
        ],
      });
    }
    try {
      const result = await this.authService.signIn(SignInDto);
      res.cookie('Authorization', 'Bearer ' + result.access_token, { httpOnly: true });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
      });
    }
    catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: error.message,
      });
    }
  }
}