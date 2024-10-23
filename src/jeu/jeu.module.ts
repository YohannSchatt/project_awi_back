import { Module } from '@nestjs/common';
import { JeuService } from './jeu.service';
import { JeuController } from './jeu.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [JeuController],
  providers: [JeuService, PrismaService],
})
export class JeuModule {}
