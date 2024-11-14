import { Controller, Post, Body , Get, Patch, Param, ParseIntPipe, Search, Req } from '@nestjs/common';
import { PositiveIntPipe } from 'src/pipe/positiveIntPipe';
import { VendeurService } from './vendeur.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { SearchVendeurDto } from './dto/search-vendeur.dto';
import { UpdateVendeurDto } from './dto/update-vendeur.dto';
import { Request } from 'express';

@Roles([Role.ADMIN,Role.GESTIONNAIRE])
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendeur')
export class VendeurController {
  constructor(private readonly vendeurService: VendeurService) {}

  @Post('createVendeur')
  createVendeur(@Body() createVendeurDto: CreateVendeurDto): Promise<Vendeur> {
    return this.vendeurService.createVendeur(createVendeurDto);
  }

  @Post('updateVendeur')
  updateVendeur(@Body() updateVendeurDto: UpdateVendeurDto): Promise<Vendeur> {
    console.log(updateVendeurDto);
    return this.vendeurService.updateVendeur(updateVendeurDto);
  }

  @Post('getListVendeur')
  getListVendeur(@Body() searchVendeurDto : SearchVendeurDto): Promise<Vendeur[]> {
    return this.vendeurService.getListVendeur(searchVendeurDto.nom, searchVendeurDto.prenom, searchVendeurDto.email, searchVendeurDto.numero);
  }

  @Get('getListVendeurCurrentSession')
  getListCurrentSessionVendeur(): Promise<Vendeur[]> {
    return this.vendeurService.getListVendeurCurrentSession();
  }

  @Patch('reinscrireVendeur/:id')
  InscriptionVendeur(@Param('id', ParseIntPipe, PositiveIntPipe) id: number): Promise<Vendeur> {
    return this.vendeurService.updateVendeurParticipation(id);
  }



}