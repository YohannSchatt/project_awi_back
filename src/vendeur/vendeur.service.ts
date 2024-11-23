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




@Injectable()
export class VendeurService {

  constructor(private readonly prisma: PrismaService, private readonly sessionService : SessionService) {}


async  enregistrerRetraitJeu(enregistrerRetraitJeuDto: EnregistrerRetraitJeuDto) {
  // Check if the vendeur exists
  const idVendeur = enregistrerRetraitJeuDto.idVendeur;
  const idJeu = enregistrerRetraitJeuDto.idJeu;

  const vendeur = await this.prisma.vendeur.findUnique({
    where: { idVendeur: idVendeur }
  });

  if (!vendeur) {
    throw new NotFoundException('Vendeur non trouvé');
  }

  // Check if the jeu exists and its status is either DISPONIBLE or DEPOSE
  const jeuUnitaire = await this.prisma.jeuUnitaire.findUnique({
    where: { idJeuUnitaire: idJeu }
  });

  if (!jeuUnitaire) {
    throw new NotFoundException('Jeu non trouvé');
  }

  if (jeuUnitaire.statut !== 'DISPONIBLE' && jeuUnitaire.statut !== 'DEPOSE') {
    throw new BadRequestException('Le statut du jeu nest pas DISPONIBLE ou DEPOSE');
  }

  // Check if the jeu's idVendeur matches the idVendeur received
  if (jeuUnitaire.idVendeur !== idVendeur) {
    throw new BadRequestException('Le jeu ne correspond pas au vendeur');
  }

  // Update the jeu's status to RECUPERER
  await this.prisma.jeuUnitaire.update({
    where: { idJeuUnitaire: idJeu },
    data: { statut: 'RECUPERER' }
    });

  }
  async enregistrerRetraitArgent(enregistrerRetraitArgentDto: EnregistrerRetraitArgentDto)  {
    // Check if the vendeur exists
    const idVendeur = enregistrerRetraitArgentDto.idVendeur;
    const montant : Decimal = new Decimal(enregistrerRetraitArgentDto.montant);
  
    const vendeur = await this.prisma.vendeur.findUnique({
      where: { idVendeur: idVendeur }
    });
  
    if (!vendeur) {
      throw new NotFoundException('Vendeur non trouvé');
    }
  
    // Check if the vendeur has enough money
    if (vendeur.sommeDue < montant) {
      throw new BadRequestException('Le solde du vendeur est insuffisant');
    }
  
    // Update the vendeur's solde
    await this.prisma.vendeur.update({
      where: { idVendeur: idVendeur },
      data: { sommeDue: new Decimal(vendeur.sommeDue).minus(montant),
              sommeRetire: new Decimal(vendeur.sommeRetire).plus(montant) }
    });

    await this.prisma.retrait.create({
      data: {
        somme: montant,
        idVendeur: idVendeur,
        date: new Date(),
      },
    });
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
    
    if(await this.sessionService.currentSessionExist()){
      await this.sessionService.ajouterParticipationSessionCourrante(newVendeur.idVendeur);
    }

    return newVendeur;
  }

  async updateVendeur(updateVendeurDto: UpdateVendeurDto): Promise<Vendeur> {
    const vendeur = await this.prisma.vendeur.findUnique({ where: { idVendeur: Number(updateVendeurDto.idVendeur) } });
    if (!vendeur) {
      throw new NotFoundException("Vendeur non trouvé");
    }

    return await this.prisma.vendeur.update({
      where: { idVendeur: Number(updateVendeurDto.idVendeur) },
      data: {
        prenom: updateVendeurDto.prenom,
        nom: updateVendeurDto.nom,
        email: updateVendeurDto.email,
        numero: updateVendeurDto.numero,
      },
    });
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

  async updateVendeurParticipation(idVendeur: number): Promise<Vendeur> {
    const vendeur = await this.prisma.vendeur.findUnique({ where: { idVendeur: Number(idVendeur) } });
    if (!vendeur) {
      throw new NotFoundException("Vendeur non trouvé");
    }

    if (await this.sessionService.currentSessionExist()) {
      await this.sessionService.ajouterParticipationSessionCourrante(idVendeur);
    }

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
