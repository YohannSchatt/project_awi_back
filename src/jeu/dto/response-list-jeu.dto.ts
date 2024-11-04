
// import { InfoJeuDto } from "./response-info-jeu.dto";

export class InfoJeuDto {
    idJeu: number;
    nom: string;
    editeur: string;
}
export class ListeJeuDto {
    jeux: InfoJeuDto[];
}
