/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { JeuModule } from './jeu/jeu.module';

@Module({
  imports: [ConfigModule.forRoot(), JeuModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
