import { Controller, Post, Body , Get} from '@nestjs/common';
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

  //updateVendeur



}