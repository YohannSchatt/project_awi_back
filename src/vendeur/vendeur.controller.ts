import { Controller, Post, Body , Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { PositiveIntPipe } from 'src/pipe/positiveIntPipe';
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

  @Get('getListVendeur')
  getListVendeur(): Promise<Vendeur[]> {
    return this.vendeurService.getListVendeur();
  }

  @Get('getListVendeurCurrentSession')
  getListCurrentSessionVendeur(): Promise<Vendeur[]> {
    return this.vendeurService.getListVendeurCurrentSession();
  }

  @Patch('reinscrireVendeur/:id')
  updateVendeur(@Param('id', ParseIntPipe, PositiveIntPipe) id: number): Promise<Vendeur> {
    return this.vendeurService.updateVendeurParticipation(id);
  }



}