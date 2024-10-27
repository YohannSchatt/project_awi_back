/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentification/auth/auth.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { GestionnaireService } from './gestionnaire/gestionnaire.service';
import { GestionnaireModule } from './gestionnaire/gestionnaire.module';
import configuration from './configuration';
import { PrismaService } from './prisma/prisma.service';
import { JeuModule } from './jeu/jeu.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
// The AppModule is the root module of the application.
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, //make the configuration module global
    envFilePath: '.env', //load configuration from a .env file
    load: [configuration], //load configuration from a configuration.ts file
  }),
    AuthModule, 
    AdminModule, 
    GestionnaireModule,
    JeuModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, AdminService, GestionnaireService, PrismaService, UserService],
})
export class AppModule {}
