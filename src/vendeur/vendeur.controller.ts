import { Controller, Post, Body , Get, Patch, Res,Param, ParseIntPipe, Search, Req, BadRequestException } from '@nestjs/common';
import { PositiveIntPipe } from '../pipe/positiveIntPipe';
import { VendeurService } from './vendeur.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { SearchVendeurDto } from './dto/search-vendeur.dto';
import { UpdateVendeurDto } from './dto/update-vendeur.dto';
// import { Request } from 'express';
import { EnregistrerRetraitJeuDto } from './dto/enregistrer-retrait-jeu.dto';
import { GetArgent } from './dto/getArgent.dto';


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
    return this.vendeurService.updateVendeur(updateVendeurDto);
  }

  @Post('enregistrerRetraitJeuArgent')
  enregistrerRetraitJeu(@Res() res,@Body() enregistrerRetraitJeuDto: EnregistrerRetraitJeuDto) {

    if (enregistrerRetraitJeuDto.idJeu.length <= 0 && !enregistrerRetraitJeuDto.argent) {
      res.status(400).send("Vous devez choisir un jeu ou de l'argent à retirer");
    }

    if (enregistrerRetraitJeuDto.idJeu.length > 0) {
      this.vendeurService.enregistrerRetraitJeu(enregistrerRetraitJeuDto.idVendeur,enregistrerRetraitJeuDto.idJeu);
    }


    if (enregistrerRetraitJeuDto.argent) {
      this.vendeurService.enregistrerRetraitArgent(enregistrerRetraitJeuDto.idVendeur);
    }

    return res.status(200).send('Retrait effectué');
  }

  @Post('GetArgent')
  getArgentVendeur(@Body() getArgentDto : GetArgent): Promise<number> {
    const argent = this.vendeurService.getArgentVendeur(getArgentDto.idVendeur);
    return argent
  }

  // @Post('enregistrerRetraitArgent')
  // enregistrerRetraitArgent(@Body() enregistrerRetraitArgentDto) {
  //   this.vendeurService.enregistrerRetraitArgent(enregistrerRetraitArgentDto);
  // }

  @Get('getListAllVendeur')
  getListAllVendeur(): Promise<Vendeur[]> {
    return this.vendeurService.getListAllVendeur();
  }

  @Post('getListVendeur')
  getListVendeur(@Body() searchVendeurDto : SearchVendeurDto): Promise<Vendeur[]> {
    return this.vendeurService.getListVendeur(searchVendeurDto.nom, searchVendeurDto.prenom, searchVendeurDto.email, searchVendeurDto.numero);
  }

  // @Get('getListVendeurCurrentSession')
  // getListCurrentSessionVendeur(): Promise<Vendeur[]> {
  //   return this.vendeurService.getListVendeurCurrentSession();
  // }

  // @Patch('reinscrireVendeur/:id')
  // InscriptionVendeur(@Param('id', ParseIntPipe, PositiveIntPipe) id: number): Promise<Vendeur> {
  //   return this.vendeurService.updateVendeurParticipation(id);
  // }



}