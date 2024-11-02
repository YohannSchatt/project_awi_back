import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { EmailService } from 'src/email/email/email.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

// The AdminModule is a feature module that encapsulates the admin feature.
@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard, RolesGuard, EmailService, UserService],
})
export class AdminModule {}