/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentification/auth/auth.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { GestionnaireService } from './gestionnaire/gestionnaire.service';
import { GestionnaireModule } from './gestionnaire/gestionnaire.module';
import configuration from './configuration';

import { JeuModule } from './jeu/jeu.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email/email.service';
import * as cookieParser from 'cookie-parser';
// The AppModule is the root module of the application.import { VendeurModule } from './vendeur/vendeur.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';
import { VendeurModule } from './vendeur/vendeur.module';
import { InvoiceModule } from './invoice/invoice.module';
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
    UserModule, VendeurModule, PrismaModule, SessionModule, InvoiceModule
  ],
  controllers: [AppController],
  providers: [AppService, /*AdminService, GestionnaireService, PrismaService, UserService*/],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*');
  }
}
