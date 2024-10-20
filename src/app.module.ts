import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentification/auth/auth.module';
import { UsersModule } from './authentification/users/users.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { GestionnaireService } from './gestionnaire/gestionnaire.service';
import { GestionnaireModule } from './gestionnaire/gestionnaire.module';
import configuration from './configuration';

// The AppModule is the root module of the application.
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, //make the configuration module global
    envFilePath: '.env', //load configuration from a .env file
    load: [configuration], //load configuration from a configuration.ts file
  }),
    AuthModule, 
    UsersModule, 
    AdminModule, 
    GestionnaireModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminService, GestionnaireService],
})
export class AppModule {}
