import { SessionService } from '../session/session.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { SearchVendeurDto } from './dto/search-vendeur.dto';
import { UpdateVendeurDto } from './dto/update-vendeur.dto';
import { Vendeur } from '@prisma/client';
import { EnregistrerRetraitJeuDto } from './dto/enregistrer-retrait-jeu.dto';
import { EnregistrerRetraitArgentDto } from './dto/enregistrer-retrait-argent.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { Statut } from '@prisma/client';




@Injectable()
export class VendeurService {

  constructor(private readonly prisma: PrismaService, private readonly sessionService : SessionService) {}


async  enregistrerRetraitJeu(idVendeur: number, idJeu: number[]) {

  const vendeur = await this.prisma.vendeur.findUnique({
    where: { idVendeur: idVendeur }
  });

  if (!vendeur) {
    throw new NotFoundException('Vendeur non trouvé');
  }

  // Check if the jeu exists and its status is either DISPONIBLE or DEPOSE
  const jeuUnitaire = await this.prisma.jeuUnitaire.findMany({
    where: { idJeuUnitaire: { in: idJeu } }
  });

  if (jeuUnitaire.length <= 0 && jeuUnitaire.length !== idJeu.length) {
    throw new NotFoundException('Jeu non trouvé');
  }

  for (let i = 0; i < jeuUnitaire.length; i++) {
    if (jeuUnitaire[i].statut !== Statut.DISPONIBLE  && jeuUnitaire[i].statut !== Statut.DEPOSE) {
      throw new BadRequestException('Le statut du jeu nest pas DISPONIBLE ou DEPOSE');
    }
    if (jeuUnitaire[i].idVendeur !== idVendeur) {
      throw new BadRequestException('Le jeu ne correspond pas au vendeur');
    }
  }

  //Update the jeu's status to RECUPERER
  const jeuUpdate = await this.prisma.jeuUnitaire.updateMany({
    where: { idJeuUnitaire: {in : idJeu} },
    data: { statut: Statut.RECUPERER }
    });

    return jeuUpdate;
  }

  async enregistrerRetraitArgent(idVendeur: number) { 
  
    const vendeur = await this.prisma.vendeur.findUnique({
      where: { idVendeur: idVendeur }
    });
  
    if (!vendeur) {
      throw new NotFoundException('Vendeur non trouvé');
    }
  
    // Update the vendeur's solde
    const updateVendeur = await this.prisma.vendeur.update({
      where: { idVendeur: idVendeur },
      data: { 
        sommeDue: 0,
        sommeRetire: new Decimal(vendeur.sommeRetire).plus(vendeur.sommeDue)
      }
    });

    await this.prisma.retrait.create({
      data: {
        somme: vendeur.sommeDue,
        idVendeur: idVendeur,
        date: new Date(),
      },
    });

    return updateVendeur;
  }

  async getArgentVendeur(idVendeur: number): Promise<number> {
    const vendeur = await this.prisma.vendeur.findUnique({
      where: { idVendeur: idVendeur }
    });

    if (!vendeur) {
      throw new NotFoundException('Vendeur non trouvé');
    }

    return Number(vendeur.sommeDue);
  }

  async createVendeur(createVendeurDto: CreateVendeurDto): Promise<Vendeur> {
    if (await this.prisma.vendeur.findUnique({where: {email: createVendeurDto.email}})) {
      throw new NotFoundException("Un vendeur avec cet email existe déjà");
    }
    
    const newVendeur = await this.prisma.vendeur.create({
      data: {
        prenom: createVendeurDto.prenom,
        nom: createVendeurDto.nom,
        email: createVendeurDto.email,
        numero: createVendeurDto.numero,
      },
    });
    
    // if(await this.sessionService.currentSessionExist()){
    //   await this.sessionService.ajouterParticipationSessionCourrante(newVendeur.idVendeur);
    // }

    return newVendeur;
  }

  async updateVendeur(updateVendeurDto: UpdateVendeurDto): Promise<Vendeur> {
    const vendeur = await this.prisma.vendeur.findUnique({ where: { idVendeur: Number(updateVendeurDto.idVendeur) } });
    if (!vendeur) {
      throw new NotFoundException("Vendeur non trouvé");
    }

    const updateVendeur = await this.prisma.vendeur.update({
      where: { idVendeur: Number(updateVendeurDto.idVendeur) },
      data: {
        prenom: updateVendeurDto.prenom,
        nom: updateVendeurDto.nom,
        email: updateVendeurDto.email,
        numero: updateVendeurDto.numero,
      },
    });

    return updateVendeur
  }

  async getListVendeur(nom : string, prenom : string, email : string, numero : string): Promise<Vendeur[]> {
    return await this.prisma.vendeur.findMany({
      where: {
        AND: [
          prenom ? { prenom: { contains: prenom, mode: 'insensitive' } } : {},
          nom ? { nom: { contains: nom, mode: 'insensitive' } } : {},
          email ? { email: { contains: email, mode: 'insensitive' } } : {},
          numero ? { numero: { contains: numero, mode: 'insensitive' } } : {},
        ],
      },
    });
  }

  async getListAllVendeur (): Promise<Vendeur[]> {
    return this.prisma.vendeur.findMany();
  }

  async updateVendeurParticipation(idVendeur: number): Promise<Vendeur> {
    const vendeur = await this.prisma.vendeur.findUnique({ where: { idVendeur: Number(idVendeur) } });
    if (!vendeur) {
      throw new NotFoundException("Vendeur non trouvé");
    }

    // if (await this.sessionService.currentSessionExist()) {
    //   await this.sessionService.ajouterParticipationSessionCourrante(idVendeur);
    // }

    return vendeur;
  }

  async getListVendeurCurrentSession(): Promise<Vendeur[]> {
    const currentSession = await this.sessionService.currentSession();
    return this.prisma.vendeur.findMany({
      where: {
        participationSessions: {
          some: {
            idSession: currentSession.idSession,
          },
        },
      },
    });
  }
}
