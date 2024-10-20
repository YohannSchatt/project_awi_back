import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentification/auth/auth.module';
import { UsersModule } from './authentification/users/users.module';
import { HelloController } from './hello/hello.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { GestionnaireService } from './gestionnaire/gestionnaire.service';
import { GestionnaireModule } from './gestionnaire/gestionnaire.module';
import configuration from './configuration';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Rendre les variables accessibles globalement
    envFilePath: '.env', // Spécifie le chemin du fichier .env
    load: [configuration], // Charge la configuration
  }),
    AuthModule, 
    UsersModule, 
    AdminModule, 
    GestionnaireModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService, AdminService, GestionnaireService],
})
export class AppModule {}
