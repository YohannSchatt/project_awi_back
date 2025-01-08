import { PositiveIntPipe } from '../pipe/positiveIntPipe';
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { JeuService } from './jeu.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JeuUnitaire, Role } from '@prisma/client';
import { InfoJeuDto } from './dto/response-list-jeu.dto';
import { InfoJeuUnitaireDisponibleDto } from './dto/info-jeu-unitaire-disponible.dto';

@Controller('jeu')
export class JeuController {
  constructor(private readonly jeuService: JeuService) {}

  @Get('catalogue/:pageNumber')
  async findFromPage(
    @Param('pageNumber', ParseIntPipe, PositiveIntPipe) pageNumber: string,
  ): Promise<CatalogueDto> {
    const pageNumberAsNumber = Number(pageNumber);
    return this.jeuService.findFromPage(pageNumberAsNumber);
  }

  @Roles([Role.ADMIN, Role.GESTIONNAIRE])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('jeuxDisponibleByVendeur/:idVendeur')
  async getJeuxDispoibleByVendeur(@Param('idVendeur' , ParseIntPipe) idVendeur: number): Promise<InfoJeuUnitaireDisponibleDto[]> {
    return this.jeuService.getJeuxDisponibleByVendeur(Number(idVendeur));
  }


  @Post('creerJeu')
  async createJeu(@Body() createJeuDto: CreateJeuDto): Promise<void> {
    await this.jeuService.createJeu(createJeuDto);
  }

  // @Roles([Role.ADMIN, Role.GESTIONNAIRE])
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('creerJeuUnitaire')
  async createJeuUnitaire(@Body() createJeuUnitaireDto: CreateJeuUnitaireDto): Promise<void> {
    await this.jeuService.createJeuUnitaire(createJeuUnitaireDto);
  }

  @Roles([Role.ADMIN, Role.GESTIONNAIRE])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('listeJeu')
  async getListeJeu(): Promise<InfoJeuDto[]> {
    return this.jeuService.getListeJeu();
  }

  @Roles([Role.ADMIN, Role.GESTIONNAIRE])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('achat')
  async vendreJeuUnitaire(
    @Body('idsJeuUnitaire', new ParseArrayPipe({ items: Number })) idsJeuUnitaire: number[],
  ): Promise<void> {
    await this.jeuService.enregistrerAchat(idsJeuUnitaire);
  }

  // @Roles([Role.ADMIN, Role.GESTIONNAIRE])
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('listInfoAchatJeuUnitaireDisponible')
  async getListInfoAchatJeuUnitaireDisponible(): Promise<InfoJeuUnitaireDisponibleDto[]> {
    return this.jeuService.getListInfoAchatJeuUnitaireDisponible();
  }
}