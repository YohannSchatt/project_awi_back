import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParticipationSession } from '@prisma/client';
import { SessionDto } from './dto/response-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { dateDebut, dateFin, description } = createSessionDto;

    // Convert string dates to Date objects
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);

    // Create the session in the database
    const session = await this.prisma.session.create({
      data: {
        dateDebut: dateDebutObj,
        dateFin: dateFinObj,
        description,
      },
    });

    return session;
  }

  async currentSessionExist(): Promise<boolean> {
    const currentDate = new Date();
    const currentSession = await this.prisma.session.findFirst({
      where: {
        dateDebut: {
          lte: currentDate,
        },
        dateFin: {
          gte: currentDate,
        },
      },
    });
    return currentSession ? true : false;
  }

  async currentSession(): Promise<SessionDto> {
    const currentDate = new Date();
    const currentExist: boolean = await this.currentSessionExist();
    if (!currentExist) {
      console.log("Il n'y a pas de session en cours");
      throw new NotFoundException("Il n'y a pas de session en cours");
    } else {
      const session = await this.prisma.session.findFirst({
        where: {
          dateDebut: {
            lte: currentDate,
          },
          dateFin: {
            gte: currentDate,
          },
        },
      });

      const formattedDateDebut = this.formatDate(session.dateDebut);
      const formattedDateFin = this.formatDate(session.dateFin);
      const formattedDateRange = `du ${formattedDateDebut} au ${formattedDateFin}`;

      return {
        ...session,
        descriptionPeriode : formattedDateRange,
      };
    }
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  async ajouterParticipationSessionCourrante(idVendeur: number): Promise<ParticipationSession> {
    const session = await this.currentSession();
    if (!session) {
      throw new NotFoundException("Il n'y a pas de session en cours");
    }
    const idSession: number = session.idSession;
    try {
      const res = await this.prisma.participationSession.create({
        data: {
          idVendeur: Number(idVendeur),
          idSession: idSession,
        },
      });
      return res;
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint error code
        throw new NotFoundException("Impossible d'ajouter le vendeur à la session courante, il est possible qu'il soit déjà inscrit");
      }
      throw new Error("Une erreur est survenue lors de l'ajout du vendeur à la session courante");
    }
  }
}
