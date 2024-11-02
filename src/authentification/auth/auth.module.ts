import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


// The AuthModule is a feature module that encapsulates the auth feature.
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}