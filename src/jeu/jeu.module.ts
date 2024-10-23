import { Module } from '@nestjs/common';
import { JeuService } from './jeu.service';
import { JeuController } from './jeu.controller';

@Module({
  controllers: [JeuController],
  providers: [JeuService],
})
export class JeuModule {}
