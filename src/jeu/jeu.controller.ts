import { PositiveIntPipe } from './../pipe/positiveIntPipe';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JeuService } from './jeu.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { UpdateJeuDto } from './dto/update-jeu.dto';
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Jeu } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('jeu')
// @Roles([Role.ADMIN,Role.GESTIONNAIRE])
// @UseGuards(JwtAuthGuard, RolesGuard)
export class JeuController {
  constructor(private readonly jeuService: JeuService) {}

  // @Post()
  // create(@Body() createJeuDto: CreateJeuDto) {
  //   return this.jeuService.create(createJeuDto);
  // }

  @Get('catalogue/:pageNumber')
  findFromPage(@Param('pageNumber', ParseIntPipe, PositiveIntPipe) pageNumber: string, ) : Promise<CatalogueDto> {
    const pageNumberAsNumber = Number(pageNumber);
    return this.jeuService.findFromPage(pageNumberAsNumber);
  }

  @Post('creerJeu')
  createJeu(@Body() createJeuDto: CreateJeuDto) {
    return this.jeuService.createJeu(createJeuDto);
  }
  @Roles([Role.ADMIN,Role.GESTIONNAIRE])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('creerJeuUnitaire')
  createJeuUnitaire(@Body() createJeuUnitaireDto: CreateJeuUnitaireDto) {
    return this.jeuService.createJeuUnitaire(createJeuUnitaireDto);
  }

  @Roles([Role.ADMIN,Role.GESTIONNAIRE])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('listeJeu')
  getListeJeu(){
    return this.jeuService.getListeJeu();
  }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.jeuService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateJeuDto: UpdateJeuDto) {
//     return this.jeuService.update(+id, updateJeuDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.jeuService.remove(+id);
//   }
}
