import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { InfoJeuUnitaireDto } from './dto/response-catalogue.dto';
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Etat, Jeu, JeuUnitaire, Statut } from '@prisma/client';
import { InfoJeuDto } from './dto/response-list-jeu.dto';
import { InfoJeuUnitaireDisponibleDto } from './dto/info-jeu-unitaire-disponible.dto';

import { CatalogueRequestDto } from './dto/catalogue-request.dto';
import { CatalogueResponseDto } from './dto/catalogue-response.dto';

import * as fs from 'fs';
import * as path from 'path';
import { InfoJeuDBDto } from './dto/infoJeuDB.dto';
import { InfoJeuStockDto } from './dto/infoJeuStock.dto';


@Injectable()
export class JeuService {
  constructor(private readonly prisma: PrismaService) {}

  async findFromPage(pageNumber: number): Promise<CatalogueDto> {
    const pageSize: number = 20; // Define the page size
    const offset: number = (pageNumber - 1) * pageSize;

    const jeuxUnitaires = await this.prisma.jeuUnitaire.findMany({
      skip: offset,
      take: pageSize,
      where: {
        statut: 'DISPONIBLE', // Filter by statut
      },
      include: {
        vendeur: true,
        jeu: true,
      },
    });

    const infoJeux: InfoJeuUnitaireDto[] = jeuxUnitaires.map((jeuUnitaire) => ({
      id: jeuUnitaire.idJeuUnitaire,
      nom: jeuUnitaire.jeu.nom,
      description: jeuUnitaire.jeu.description,
      editeur: jeuUnitaire.jeu.editeur,
      prix: Number(jeuUnitaire.prix), // Convert Decimal to number
      prenomVendeur: jeuUnitaire.vendeur.prenom,
      nomVendeur: jeuUnitaire.vendeur.nom,
      image: this.getStringifiedImage(jeuUnitaire.jeu.idJeu), // Example stringified image
      etat: jeuUnitaire.etat, // Include the etat property
    }));

    return { jeux: infoJeux };
  }

  async createJeu(createJeuDto: CreateJeuDto): Promise<Jeu> {
    return this.prisma.jeu.create({
      data: {
        nom: createJeuDto.nom,
        editeur: createJeuDto.editeur,
        description: createJeuDto.description || null,
      },
    });
  }

  async createJeuUnitaire(createJeuUnitaireDto: CreateJeuUnitaireDto): Promise<void> {
    const idJeu: number = createJeuUnitaireDto.idJeu;
    const idVendeur: number = createJeuUnitaireDto.idVendeur;

    // Check if the Vendeur exists
    const vendeur = await this.prisma.vendeur.findUnique({
      where: { idVendeur },
    });
    if (!vendeur) {
      throw new NotFoundException(`Aucun vendeur avec l'id ${idVendeur} n'a été trouvé`);
    }

    // Check if the Jeu exists
    const jeu = await this.prisma.jeu.findUnique({
      where: { idJeu },
    });
    if (!jeu) {
      throw new NotFoundException(`Aucun jeu avec l'id ${idJeu} n'a été trouvé`);
    }

    await this.prisma.jeuUnitaire.create({
      data: createJeuUnitaireDto,
    });
  }

  async getListeJeu(): Promise<InfoJeuDto[]> {
    const jeux = await this.prisma.jeu.findMany();
    return jeux.map((jeu) => ({
      idJeu: jeu.idJeu,
      nom: jeu.nom,
      editeur: jeu.editeur,
    }));
  }


  async vendreJeuUnitaire(idJeuUnitaire: number): Promise<void> {
    const jeuUnitaire = await this.prisma.jeuUnitaire.findUnique({
      where: { idJeuUnitaire },
      include: { vendeur: true },
    });
    if (!jeuUnitaire) {
      throw new NotFoundException(`Aucun JeuUnitaire avec l'id ${idJeuUnitaire} n'a été trouvé`);
    }
    if (jeuUnitaire.statut !== 'DISPONIBLE') {
      throw new BadRequestException("Le JeuUnitaire n'est pas disponible à la vente");
    }

    await this.prisma.vendeur.update({
      where: { idVendeur: jeuUnitaire.idVendeur },
      data: {
        sommeTotale: { increment: jeuUnitaire.prix },
        sommeDue: { increment: jeuUnitaire.prix },
      },
    });

    await this.prisma.jeuUnitaire.update({
      where: { idJeuUnitaire },
      data: {
        statut: 'VENDU',
        dateAchat: new Date(),
      },
    });
  }

  async getListInfoAchatJeuUnitaireDisponible(): Promise<InfoJeuUnitaireDisponibleDto[]> {
    const jeuxDisponibles = await this.prisma.jeuUnitaire.findMany({
      where: { statut: 'DISPONIBLE' },
      select: {
        idJeuUnitaire: true,
        prix: true,
        etat: true,
        jeu: {
          select: {
            nom: true,
            editeur: true,
          },
        },
      },
    });
    return jeuxDisponibles.map((jeu) => ({
      idJeuUnitaire: jeu.idJeuUnitaire,
      prix: Number(jeu.prix),
      nom: jeu.jeu.nom,
      editeur: jeu.jeu.editeur,
      etat: jeu.etat,
    }));
  }

  private getStringifiedImage(idJeu: number): string {
    try {
      // Remonte de "src/jeu" vers la racine, puis pointe sur "images"
      const filePath = path.join(__dirname, '..', '..', 'images', `${idJeu}.png`);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
      }
      return '';
    } catch (error) {
      return '';
    }
  }
  
  async enregistrerAchat(idsJeuUnitaire: number[]): Promise<void> {
    // Fetch all JeuUnitaire records with the provided IDs, including their vendeur
    const jeuxUnitaires = await this.prisma.jeuUnitaire.findMany({
      where: { idJeuUnitaire: { in: idsJeuUnitaire } },
      include: { vendeur: true },
    });
  
    // Check if all IDs were found
    if (jeuxUnitaires.length !== idsJeuUnitaire.length) {
      throw new NotFoundException(`Certains JeuUnitaires n'ont pas été trouvés`);
    }
  
    // Check if all JeuUnitaires are available
    const unavailableJeux = jeuxUnitaires.filter((jeu) => jeu.statut !== 'DISPONIBLE');
    if (unavailableJeux.length > 0) {
      throw new BadRequestException('Certains JeuUnitaires ne sont pas disponibles à la vente');
    }
  
    // Extract unique vendeur IDs from the jeuxUnitaires
    const vendeurIds = [...new Set(jeuxUnitaires.map((jeu) => jeu.idVendeur))];
  
    // Check that all vendeurs exist
    const vendeurs = await this.prisma.vendeur.findMany({
      where: { idVendeur: { in: vendeurIds } },
    });
  
    if (vendeurs.length !== vendeurIds.length) {
      throw new NotFoundException(`Certains vendeurs n'existent pas`);
    }
  
    // Perform updates in a transaction
    await this.prisma.$transaction(async (prisma) => {
      // Loop over each jeuUnitaire
      for (const jeuUnitaire of jeuxUnitaires) {
        // Update the vendeur's sommeTotale and sommeDue
        await prisma.vendeur.update({
          where: { idVendeur: jeuUnitaire.idVendeur },
          data: {
            sommeTotale: { increment: jeuUnitaire.prix },
            sommeDue: { increment: jeuUnitaire.prix },
          },
        });
  
        // Update the jeuUnitaire's statut and dateAchat
        await prisma.jeuUnitaire.update({
          where: { idJeuUnitaire: jeuUnitaire.idJeuUnitaire },
          data: {
            statut: 'VENDU',
            dateAchat: new Date(),
          },
        });
      }
    });
  }


  async getJeuxDisponibleByVendeur(idVendeur: number): Promise<InfoJeuUnitaireDisponibleDto[]> {
    // Verify that the vendeur exists
    const vendeur = await this.prisma.vendeur.findUnique({
      where: { idVendeur },
    });

    if (!vendeur) {
      throw new NotFoundException(`Aucun vendeur avec l'id ${idVendeur} n'a été trouvé`);
    }

    // Fetch the JeuUnitaires with status 'DISPONIBLE' or 'DEPOSE' for the given vendeur
    const jeuxDisponibles = await this.prisma.jeuUnitaire.findMany({
      where: {
        idVendeur,
        statut: { in: ['DISPONIBLE', 'DEPOSE'] },
      },
      select: {
        idJeuUnitaire: true,
        prix: true,
        etat : true,
        jeu: {
          select: {
            nom: true,
            editeur: true, 
          },
        },
      },
    });

    // Map the results to InfoJeuUnitaireDisponibleDto
    return jeuxDisponibles.map((jeu) => ({
      idJeuUnitaire: jeu.idJeuUnitaire,
      prix: Number(jeu.prix),
      nom: jeu.jeu.nom,
      editeur: jeu.jeu.editeur,
      etat: jeu.etat,
    }));
  }
  
  async getCatalogue(query: CatalogueRequestDto): Promise<CatalogueResponseDto> {
    const { nom, editeur, prixMin, prixMax, page } = query;
    const pageSize = 10; // Nombre d’éléments par page

    // Construction du where pour la table JeuUnitaire
    // On cherche les JeuUnitaires en statut DISPONIBLE
    // et on filtre sur le nom/editeur dans le modèle Jeu
    const whereClause: any = {
      statut: Statut.DISPONIBLE,
      prix: {
        gte: prixMin ?? 0,
        lte: prixMax ?? 9999999,
      },
      jeu: {
        // Si le champ est vide, on ne filtre pas
        nom: nom ? { contains: nom, mode: 'insensitive' } : undefined,
        editeur: editeur ? { contains: editeur, mode: 'insensitive' } : undefined,
      },
    };

    // Comptage du nombre total d’éléments correspondants
    const totalItems = await this.prisma.jeuUnitaire.count({ where: whereClause });

    // Calcul du nombre de pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Pagination
    const offset = (page - 1) * pageSize;

    // Récupération des JeuUnitaires filtrés et paginés
    const jeuUnitaires = await this.prisma.jeuUnitaire.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      include: {
        jeu: true, // Pour avoir nom, editeur, description, etc.
        vendeur: true, // Pour avoir les informations du vendeur
      },
    });

    // Conversion des résultats en DTO
    const items = jeuUnitaires.map((jeuU) => ({
      id: jeuU.idJeuUnitaire,
      nom: jeuU.jeu.nom,
      description: jeuU.jeu.description ?? '',
      editeur: jeuU.jeu.editeur,
      prix: Number(jeuU.prix),
      image: this.getStringifiedImage(jeuU.idJeu),
      prenomVendeur: jeuU.vendeur.prenom,
      nomVendeur: jeuU.vendeur.nom,
      etat: jeuU.etat,
    }));

    return { totalPages, nbJeux: totalItems, items };
  }


  async updateEtatJeuUnitaire(idJeuUnitaire: number, statut: Statut): Promise<Boolean> {
    try {
      const res = await this.prisma.jeuUnitaire.updateMany({
        where: { idJeuUnitaire: idJeuUnitaire },
        data: { statut: statut },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getJeuxByEtat(statut: Statut, idJeu?: number, Idvendeur?: number): Promise<InfoJeuStockDto[]> {
    const jeux = await this.prisma.jeuUnitaire.findMany({
      where: { 
        statut: statut, 
        idJeu: idJeu ? idJeu : undefined,
        idVendeur: Idvendeur  ? Idvendeur : undefined,
      },
      select: {
        idJeuUnitaire: true,
        prix: true,
        jeu: {
          select: {
            nom: true,
            editeur: true,
            description: true,
            idJeu: true,
          },
        },
      },
    });

    return jeux.map((jeu) => ({
      idJeuUnitaire: jeu.idJeuUnitaire,
      prix: Number(jeu.prix),
      nom: jeu.jeu.nom,
      editeur: jeu.jeu.editeur,
      statut : statut,
      description: jeu.jeu.description,
    }));
  }

  getDBJeu(nom?: string, editeur?: string, IdJeu?: number): Promise<InfoJeuDBDto[]> {
    return this.prisma.jeu.findMany({
      where: {
        nom: nom ? { contains: nom, mode: 'insensitive' } : undefined,
        editeur: editeur ? { contains: editeur, mode: 'insensitive' } : undefined,
        idJeu: IdJeu ? IdJeu : undefined,
      },
      select: {
        nom: true,
        editeur: true,
        description: true,
        idJeu: true,
      },
    });
  }
}