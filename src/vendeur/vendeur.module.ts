import { Module } from '@nestjs/common';
import { VendeurService } from './vendeur.service';
import { VendeurController } from './vendeur.controller';
import { SessionService } from 'src/session/session.service';

@Module({
  controllers: [VendeurController],
  providers: [VendeurService, SessionService],
})
export class VendeurModule {}
