import { Module } from '@nestjs/common';
import { GestionnaireController } from './gestionnaire.controller';

@Module({
  controllers: [GestionnaireController]
})
export class GestionnaireModule {}
