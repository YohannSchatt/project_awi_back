import { Controller, Post, Body , Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { PositiveIntPipe } from 'src/pipe/positiveIntPipe';
import { VendeurService } from './vendeur.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';

@Roles([Role.ADMIN,Role.GESTIONNAIRE])
@UseGuards(JwtAuthGuard, RolesGuard)
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