import { Body, Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorators';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

    constructor(private readonly adminService: AdminService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    adminEndpoint() {
      return 'This is an admin endpoint';
    }

    @Get('Name')
    @HttpCode(HttpStatus.OK)
    adminDataNameEndpoint(@CurrentUser() user : any) {
        return this.adminService.getAdminDataName(user);
    }
}
