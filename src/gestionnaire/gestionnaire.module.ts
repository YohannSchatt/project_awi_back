import { Module } from '@nestjs/common';
import { GestionnaireController } from './gestionnaire.controller';
import { GestionnaireService } from './gestionnaire.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

// The GestionnaireModule is a feature module that encapsulates the gestionnaire feature.
@Module({
  imports: [],
  controllers: [GestionnaireController],
  providers: [GestionnaireService, JwtAuthGuard, RolesGuard],
})
export class GestionnaireModule {}
