import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { GestionnaireService } from './gestionnaire.service';

// The GestionnaireController is a RESTful controller that implements the gestionnaire feature.
// The @Controller() decorator defines the base route for the gestionnaire feature.
// The @Roles() decorator specifies the roles that are allowed to access the gestionnaire feature.
// The @UseGuards() decorator specifies the guards that are applied to the gestionnaire controller.
@Controller('gestionnaire')
@Roles([Role.ADMIN,Role.GESTIONNAIRE])
@UseGuards(JwtAuthGuard, RolesGuard)
export class GestionnaireController {

  constructor(private readonly gestionnaireService: GestionnaireService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    gestionnaireEndpoint() {
      return 'This is a gestionnaire endpoint';
    }

    @Get('dashboard/vendeur/:vendeurId/session/:sessionId')
    @HttpCode(HttpStatus.OK)
    dashboardVendeurSession(@Param('vendeurId') vendeurId: number, @Param('sessionId') sessionId: number) {
      return this.gestionnaireService.getDashboard(Number(vendeurId), Number(sessionId));
    }

    @Get('dashboard/session/:sessionId/vendeur/:vendeurId')
    @HttpCode(HttpStatus.OK)
    dashboardSessionVendeur(@Param('vendeurId') vendeurId: number, @Param('sessionId') sessionId: number) {
      return this.gestionnaireService.getDashboard(Number(vendeurId), Number(sessionId));
    }

    @Get('dashboard/vendeur/:vendeurId')
    @HttpCode(HttpStatus.OK)
    dashboardVendeur(@Param('vendeurId') vendeurId: number) {
      return this.gestionnaireService.getDashboard(Number(vendeurId), undefined);
    }

    @Get('dashboard/session/:sessionId')
    @HttpCode(HttpStatus.OK)
    dashboardSession(@Param('sessionId') sessionId: number) {
      return this.gestionnaireService.getDashboard(undefined, Number(sessionId));
    }

    @Get('dashboard')
    @HttpCode(HttpStatus.OK)
    dashboard() {
      return this.gestionnaireService.getDashboard(undefined, undefined);
    }
}
