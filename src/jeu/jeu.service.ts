import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { UpdateJeuDto } from './dto/update-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { InfoJeuDto } from './dto/response-info-jeu.dto';

@Injectable()
export class JeuService {

 

  constructor(private readonly prisma: PrismaService) {}

  create(createJeuDto: CreateJeuDto) {
    return 'This action adds a new jeu';
  }

  async findFromPage(pageNumber: number): Promise<CatalogueDto> {
    const pageSize : number = 20; // Define the page size
    const offset : number = (pageNumber - 1) * pageSize;

    const jeuxUnitaires = await this.prisma.jeuUnitaire.findMany({
      skip: offset,
      take: pageSize,
      include: {
        vendeur: true,
        jeu: true,
      },
      
    });

    const infoJeux: InfoJeuDto[] = jeuxUnitaires.map(jeuUnitaire => ({
      id: jeuUnitaire.idJeuUnitaire,
      nom: jeuUnitaire.jeu.nom,
      description: jeuUnitaire.jeu.description,
      editeur: jeuUnitaire.jeu.editeur,
      prix: Number(jeuUnitaire.prix), // Convert Decimal to number
      nomVendeur: jeuUnitaire.vendeur.nom,
      image: getStringifiedImage(jeuUnitaire.jeu.idJeu), // Example stringified image
    }));

    return { jeux: infoJeux };
  }

  // findFromPage(pageNumber: number) {
  //   return `This action returns all jeu from page ${pageNumber}`;
  // }

  // findAll(pageNumber: number) {
  //   return `This action returns all jeu`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} jeu`;
  }

  update(id: number, updateJeuDto: UpdateJeuDto) {
    return `This action updates a #${id} jeu`;
  }

  remove(id: number) {
    return `This action removes a #${id} jeu`;
  }
}
function getStringifiedImage(idJeu: number): string {
  return 'to complete';
}

