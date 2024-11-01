import { Body, Controller, Post, HttpCode, HttpStatus, Get, Req, BadRequestException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Payload } from 'src/common/interface/payload.interface';


// The AdminController is a RESTful controller that implements the admin feature.
// The @Controller() decorator defines the base route for the admin feature.
// The @Roles() decorator specifies the roles that are allowed to access the admin feature.
// The @UseGuards() decorator specifies the guards that are applied to the admin controller.
@Controller('admin')
@Roles([Role.ADMIN])
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

    constructor(private readonly adminService: AdminService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    adminEndpoint() {
      return 'This is an admin endpoint';
    }

    // The createGestionnaire() method is a POST endpoint that creates a new gestionnaire.
    // The @Post() decorator specifies that this is a POST endpoint.
    // The @Body() decorator extracts the request body from the HTTP request.
    // The @HttpCode() decorator specifies the HTTP status code to return.
    @Post('createGestionnaire')
    @HttpCode(HttpStatus.CREATED)
    createGestionnaire(@Req() req : Request) {
      if (req.body.email && req.body.prenom && req.body.nom) {
        this.adminService.createGestionnaire(req.body.email, req.body.prenom, req.body.nom, Role.GESTIONNAIRE);
      }
      else {
        throw new BadRequestException('Body Incorrect');
      }
    }

    @Post('deleteGestionnaire')
    @HttpCode(HttpStatus.OK)
    deleteGestionnaire(@Req() req : Request) {
      if (req.body.email) {
        this.adminService.deleteGestionnaire(req.body.email)
      }
      else {
        throw new BadRequestException('Body Incorrect')
      }
    }

  @Get('getGestionnaire')
  @HttpCode(HttpStatus.OK)
  getGestionnaire(@Req() req : Request) {
    return this.adminService.getGestionnaire()
  }
}