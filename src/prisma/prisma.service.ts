/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.fillDatabase();
  }

  async fillDatabase() {
    if ((await this.utilisateur.count()) < 1) {
      await this.utilisateur.createMany({
        data: [
          {
            prenom: 'shane',
            nom: 'donnelly',
            email: 'shane@example.com',
            password: 'password123', // Ensure to hash passwords in a real application
            role: 'GESTIONNAIRE',
          },
          {
            prenom: 'yohann',
            nom: 'schatt',
            email: 'yohann@example.com',
            password: 'password123', // Ensure to hash passwords in a real application
            role: 'GESTIONNAIRE',
          },
        ],
      });
    console.log('Database has been filled with initial data.');
    }
    else {
      console.log('Database already contains data. Skipped filling.');
    }
  }

}
  
