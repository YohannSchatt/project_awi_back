import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { AuthService } from '../../authentification/auth/auth.service';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['Authorization'];

    if (token && !(await this.authService.isTokenValid(token))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token is invalid',
      });
    }

    next();
  }
}