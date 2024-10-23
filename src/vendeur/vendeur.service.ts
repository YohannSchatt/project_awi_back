import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';

@Injectable()
export class VendeurService {
  constructor(private readonly prisma: PrismaService) {}

  async createVendeur(createVendeurDto: CreateVendeurDto): Promise<Vendeur> {
    return this.prisma.vendeur.create({
      data: {
        prenom: createVendeurDto.prenom,
        nom: createVendeurDto.nom,
        email: createVendeurDto.email,
        numero: createVendeurDto.numero,
      },
    });
  }
}
