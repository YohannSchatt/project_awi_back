/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentification/auth/auth.module';
import { UsersModule } from './authentification/users/users.module';
import { Constants } from './constants';
import configuration from './configuration';
import { PrismaService } from './prisma/prisma.service';
import { JeuModule } from './jeu/jeu.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Rendre les variables accessibles globalement
    envFilePath: '.env', // Spécifie le chemin du fichier .env
    load: [configuration], // Charge la configuration
  }),
    AuthModule, 
    UsersModule,
    JeuModule
  ],
  controllers: [AppController],
  providers: [AppService, Constants, PrismaService],
})
export class AppModule {}
