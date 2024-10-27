/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.fillDatabase();
  }

  async fillDatabase() {
    await this.create2Gestionnaire();
    await this.addVendeur();
    await this.addJeu();
    await this.addJeuUnitaire();
  }

  async create2Gestionnaire() {
    const salt = await bcrypt.genSalt(10);
    if ((await this.utilisateur.count()) < 1) {
      await this.utilisateur.createMany({
        data: [
          {
            prenom: 'shane',
            nom: 'donnelly',
            email: 'shane@example.com',
            password: await bcrypt.hash('password123',salt), // Ensure to hash passwords in a real application
            role: 'GESTIONNAIRE',
          },
          {
            prenom: 'yohann',
            nom: 'schatt',
            email: 'yohann@example.com',
            password: await bcrypt.hash('password1234',salt), // Ensure to hash passwords in a real application
            role: 'ADMIN',
          },
        ],
      });
      console.log('Database has been filled with initial data for gestionnaires.');
    } else {
      console.log('Database already contains gestionnaires. Skipped filling.');
    }
  }

  async addVendeur() {
    if ((await this.vendeur.count()) < 1) {
      await this.vendeur.createMany({
        data: [
          {
            nom: 'Vendeur1',
            email: 'vendeur1@example.com',
            numero: '1234567890',
            sommeTotale: 1000.00,
            sommeDue: 500.00,
            sommeRetire: 500.00,
          },
          {
            nom: 'Vendeur2',
            email: 'vendeur2@example.com',
            numero: '0987654321',
            sommeTotale: 2000.00,
            sommeDue: 1000.00,
            sommeRetire: 1000.00,
          },
        ],
      });
      console.log('Database has been filled with initial data for vendeurs.');
    } else {
      console.log('Database already contains vendeurs. Skipped filling.');
    }
  }

  async addJeu() {
    if ((await this.jeu.count()) < 1) {
      await this.jeu.createMany({
        data: [
          {
            nom: 'Jeu1',
            editeur: 'Editeur1',
            description: 'Description of Jeu1',
          },
          {
            nom: 'Jeu2',
            editeur: 'Editeur2',
            description: 'Description of Jeu2',
          },
        ],
      });
      console.log('Database has been filled with initial data for jeux.');
    } else {
      console.log('Database already contains jeux. Skipped filling.');
    }
  }

  async addJeuUnitaire() {
    const vendeurs = await this.vendeur.findMany();
    const jeux = await this.jeu.findMany();

    if ((await this.jeuUnitaire.count()) < 1 && vendeurs.length > 0 && jeux.length > 0) {
      await this.jeuUnitaire.createMany({
        data: [
          {
            prix: 50.00,
            statut: 'DISPONIBLE',
            dateAchat: new Date(),
            etat: 'NEUF',
            idVendeur: vendeurs[0].idVendeur,
            idJeu: jeux[0].idJeu,
          },
          {
            prix: 75.00,
            statut: 'DISPONIBLE',
            dateAchat: new Date(),
            etat: 'BONNE_ETAT',
            idVendeur: vendeurs[1].idVendeur,
            idJeu: jeux[1].idJeu,
          },
        ],
      });
      console.log('Database has been filled with initial data for jeux unitaires.');
    } else {
      console.log('Database already contains jeux unitaires or missing vendeurs/jeux. Skipped filling.');
    }
  }
}