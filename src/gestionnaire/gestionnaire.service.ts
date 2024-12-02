import { Injectable } from '@nestjs/common';
import { DashboardDto } from './dto/dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Vendeur, Session, Statut, Jeu } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { VenteDto } from './dto/vente.dto';

// The GestionnaireService is a service that provides gestionnaire-related functionality.
@Injectable()
export class GestionnaireService {

    constructor(private readonly prisma: PrismaService) {}
    
    // The getDashboard() method returns the dashboard.
    async getDashboard(vendeurId?: number, sessionId?: number): Promise<DashboardDto> {
        const vendeur = await this.prisma.vendeur.findMany({
            where: vendeurId ? { idVendeur: vendeurId } : {},
        });

        const session = await this.prisma.session.findMany({
            where: sessionId ? { idSession: sessionId } : {},
        });

        return this.searchInfo(vendeurId, sessionId, vendeur, session);
    }

    // The searchVentes() method searches for ventes.
    async searchInfo(vendeurId: number, sessionId:number,vendeur?: Vendeur[], session?: Session[]) : Promise<DashboardDto> {
        const dashboard = new DashboardDto();

        await this.searchVentes(vendeur, session,vendeurId,sessionId).then(
            (ventes) => {
                dashboard.DetailVentes = ventes;
            }
        )

        if (vendeur.length == 1 || session.length == 1) {
    
            dashboard.ArgentGagneSession = new Decimal(0);
            dashboard.ArgentComission = new Decimal(0);
            for (let vente of dashboard.DetailVentes) {
                dashboard.ArgentGagneSession = dashboard.ArgentGagneSession.plus(vente.prix);
                if (session.length == 1) {
                    dashboard.ArgentComission = dashboard.ArgentComission.plus(session[0].comission);
                }
            }
            
            dashboard.ArgentARendreSession = new Decimal(0);
            if (!dashboard.ArgentComission.equals(0) && !dashboard.ArgentGagneSession.equals(0)) {
                dashboard.ArgentARendreSession = dashboard.ArgentGagneSession.minus(dashboard.ArgentComission);
            }
            if (vendeur) {
                dashboard.ArgentTotal = new Decimal(vendeur[0].sommeTotale);
                dashboard.sommeDue = new Decimal(vendeur[0].sommeDue);
                dashboard.sommeRetire = new Decimal(vendeur[0].sommeRetire);
            }
            
        }
        else {
            const vendeurs = await this.prisma.vendeur.findMany()
            
            dashboard.ArgentTotal = new Decimal(0);
            dashboard.sommeDue = new Decimal(0);
            dashboard.sommeRetire = new Decimal(0);

            for (let vendeur of vendeurs) {
                dashboard.ArgentTotal = dashboard.ArgentTotal.plus(vendeur.sommeTotale);
                dashboard.sommeDue = dashboard.sommeDue.plus(vendeur.sommeDue);
                dashboard.sommeRetire = dashboard.sommeRetire.plus(vendeur.sommeRetire);
            }

        }

        return dashboard;
    }

    private async searchVentes(vendeurTab: Vendeur[], sessionTab: Session[],idVendeur?: number, idSession?:number) : Promise<VenteDto[]> {
        const ventesDetail : VenteDto[] = [];
        const ventes = await this.prisma.jeuUnitaire.findMany({
            where: {
                AND: [
                    idVendeur ? { idVendeur: vendeurTab[0].idVendeur } : {},
                    idSession ? { dateAchat: { gte: sessionTab[0].dateDebut, lte: sessionTab[0].dateFin } } : {},
                    { statut: Statut.VENDU }
                ]
            }
        })
        const jeu = await this.prisma.jeu.findMany();
        for (let v of ventes) {
            const vente : VenteDto = new VenteDto();
            vente.nomJeu = this.searchJeuName(v.idJeu,jeu);
            vente.nomVendeur = this.searchVendeurName(v.idVendeur,vendeurTab);
            vente.nomSession = this.searchSessionName(v.dateAchat,sessionTab);
            vente.dateAchat = v.dateAchat;
            vente.prix = v.prix;
            ventesDetail.push(vente);
        }

        return ventesDetail;
    }

    private searchJeuName(idJeu: number, jeu:Jeu[]) : string {
        var i : number = 0;
        const found : boolean = false;
        var nom : string = "Not found";
        while(!found && i < jeu.length) {
            if (jeu[i].idJeu == idJeu) {
                nom = jeu[i].nom;
            }
            i++;
        }
        return nom
    }

    private searchVendeurName(idVendeur: number,vendeur:Vendeur[]) : string {
        var i : number = 0;
        const found : boolean = false;
        var nom : string = "Not found";
        while(!found && i < vendeur.length) {
            if (vendeur[i].idVendeur == idVendeur) {
                nom = vendeur[i].nom;
            }
            i++;
        }
        return nom
    }

    private searchSessionName(dataAchat: Date,session:Session[]) : string {
        var i : number = 0;
        const found : boolean = false;
        var nom : string = "Not found";
        while(!found && i < session.length) {
            if (session[i].dateDebut <= dataAchat && session[i].dateFin >= dataAchat) {
                nom = session[i].titre;
            }
            i++;
        }
        return nom
    }
}