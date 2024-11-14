import { SessionService } from '../session/session.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { SearchVendeurDto } from './dto/search-vendeur.dto';
import { UpdateVendeurDto } from './dto/update-vendeur.dto';
import { Vendeur } from '@prisma/client';


@Injectable()
export class VendeurService {
  constructor(private readonly prisma: PrismaService, private readonly sessionService : SessionService) {}

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
