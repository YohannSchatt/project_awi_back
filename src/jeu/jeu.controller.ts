import { PositiveIntPipe } from './../pipe/positiveIntPipe';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JeuService } from './jeu.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { CatalogueDto } from './dto/response-catalogue.dto';
import { UpdateJeuDto } from './dto/update-jeu.dto';
import { CreateJeuUnitaireDto } from './dto/create-jeu-unitaire.dto';
import { Jeu } from '@prisma/client';
@Controller('jeu')
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

  @Post('creerJeuUnitaire')
  createJeuUnitaire(@Body() createJeuUnitaireDto: CreateJeuUnitaireDto) {
    return this.jeuService.createJeuUnitaire(createJeuUnitaireDto);
  }

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
