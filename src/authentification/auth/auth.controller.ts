import { Body, Controller, Post, HttpCode, HttpStatus, Res, UseGuards, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';
import { verify } from 'crypto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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
      res.cookie('Authorization', 'Bearer ' + result.access_token, { httpOnly: true, maxAge: 3600000 });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        user : await this.authService.GetUserWithId(result.idUtilisateur),
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

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req : Request, @Res() res : Response) {
    const token = req.cookies['Authorization'];

    await this.authService.invalidateToken(token);

    res.clearCookie('Authorization');

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User logged out successfully',
    });
  }

  @Post('refresh')
  async refresh(@Res() res) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
    });
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verify(@Req() req : Request) {
    return this.authService.verify(req.user.idUtilisateur);
  }
}