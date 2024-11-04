import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
// import { UpdateJeuDto } from './dto/update-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { InfoJeuUnitaireDto } from "./dto/response-catalogue.dto"
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Jeu } from '@prisma/client';
import { InfoJeuDto } from './dto/response-list-jeu.dto';

@Injectable()
export class JeuService {
  
  
  
  constructor(private readonly prisma: PrismaService) {}
  
  // create(createJeuDto: CreateJeuDto) {
  //   return 'This action adds a new jeu';
  // }
  
  async findFromPage(pageNumber: number): Promise<CatalogueDto> {
    const pageSize : number = 20; // Define the page size
    const offset : number = (pageNumber - 1) * pageSize;
    
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
    
    const infoJeux: InfoJeuUnitaireDto[] = jeuxUnitaires.map(jeuUnitaire => ({
      id: jeuUnitaire.idJeuUnitaire,
      nom: jeuUnitaire.jeu.nom,
      description: jeuUnitaire.jeu.description,
      editeur: jeuUnitaire.jeu.editeur,
      prix: Number(jeuUnitaire.prix), // Convert Decimal to number
      prenomVendeur: jeuUnitaire.vendeur.prenom,
      nomVendeur: jeuUnitaire.vendeur.nom,
      image: this.getStringifiedImage(jeuUnitaire.jeu.idJeu), // Example stringified image
      etat: jeuUnitaire.etat, // Include the statut property
    }));
    
    return { jeux: infoJeux };
  }
  
  async createJeu(createJeuDto: CreateJeuDto) : Promise<Jeu> {
    return this.prisma.jeu.create({
      data: {
        nom: createJeuDto.nom,
        editeur: createJeuDto.editeur,
        description: createJeuDto.description || null,
      },
    });
  }
  
  async createJeuUnitaire(createJeuUnitaireDto: CreateJeuUnitaireDto) {
    const idJeu : number = createJeuUnitaireDto.idJeu;
    const idVendeur : number = createJeuUnitaireDto.idVendeur;
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

    return this.prisma.jeuUnitaire.create({
      data: createJeuUnitaireDto,
    });
  }

  
  async getListeJeu(): Promise<InfoJeuDto[]> {
    const jeux = await this.prisma.jeu.findMany();
    return jeux.map(jeu => ({
      idJeu: jeu.idJeu,
      nom: jeu.nom,
      editeur: jeu.editeur,
    }));
  }
  getStringifiedImage(idJeu: number): string {
    return 'to complete';
  }

}