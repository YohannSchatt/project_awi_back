import { Controller, Post, Body } from '@nestjs/common';
import { VendeurService } from './vendeur.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';

@Controller('vendeur')
export class VendeurController {
  constructor(private readonly vendeurService: VendeurService) {}

  @Post('creerVendeur')
  createVendeur(@Body() createVendeurDto: CreateVendeurDto): Promise<Vendeur> {
    return this.vendeurService.createVendeur(createVendeurDto);
  }
}