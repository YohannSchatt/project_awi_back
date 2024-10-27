import { Body, Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminService } from './admin.service';


// The AdminController is a RESTful controller that implements the admin feature.
// The @Controller() decorator defines the base route for the admin feature.
// The @Roles() decorator specifies the roles that are allowed to access the admin feature.
// The @UseGuards() decorator specifies the guards that are applied to the admin controller.
@Controller('admin')
@Roles([Role.Admin])
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

    constructor(private readonly adminService: AdminService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    adminEndpoint() {
      return 'This is an admin endpoint';
    }
}
