import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GestionnaireService } from './gestionnaire.service';

// The GestionnaireController is a RESTful controller that implements the gestionnaire feature.
// The @Controller() decorator defines the base route for the gestionnaire feature.
// The @Roles() decorator specifies the roles that are allowed to access the gestionnaire feature.
// The @UseGuards() decorator specifies the guards that are applied to the gestionnaire controller.
@Controller('gestionnaire')
@Roles([Role.Admin,Role.Gestionnaire])
@UseGuards(JwtAuthGuard, RolesGuard)
export class GestionnaireController {

  constructor(private readonly gestionnaireService: GestionnaireService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    gestionnaireEndpoint() {
      return 'This is a gestionnaire endpoint';
    }

    @Get('Name')
    @HttpCode(HttpStatus.OK)
    gestionnaireDataNameEndpoint(@CurrentUser() user : any) {
        return this.gestionnaireService.getGestionnaireDataName(user);
    }
}
