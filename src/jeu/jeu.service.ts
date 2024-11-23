import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { InfoJeuUnitaireDto } from './dto/response-catalogue.dto';
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Jeu, JeuUnitaire } from '@prisma/client';
import { InfoJeuDto } from './dto/response-list-jeu.dto';
import { InfoJeuUnitaireDisponibleDto } from './dto/info-achat-jeu-unitaire-disponible.dto';

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

  getStringifiedImage(idJeu: number): string {
    return 'to complete';
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
        jeu: {
          select: {
            nom: true,
          },
        },
      },
    });
    return jeuxDisponibles.map((jeu) => ({
      idJeuUnitaire: jeu.idJeuUnitaire,
      prix: Number(jeu.prix),
      nom: jeu.jeu.nom,
    }));
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
        jeu: {
          select: {
            nom: true,
          },
        },
      },
    });

    // Map the results to InfoJeuUnitaireDisponibleDto
    return jeuxDisponibles.map((jeu) => ({
      idJeuUnitaire: jeu.idJeuUnitaire,
      prix: Number(jeu.prix),
      nom: jeu.jeu.nom,
    }));
  }
 
}