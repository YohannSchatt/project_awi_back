/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';


import { JeuModule } from './jeu/jeu.module';
import { VendeurModule } from './vendeur/vendeur.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [ConfigModule.forRoot(), JeuModule, VendeurModule, PrismaModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
