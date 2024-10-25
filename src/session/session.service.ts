import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParticipationSession } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

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

  async currentSession(): Promise<Session> {
    const currentDate = new Date();
    if(!this.currentSessionExist()){
      throw new NotFoundException("Il n'y a pas de session en cours");
    }
    else{
      return this.prisma.session.findFirst({
        where: {
          dateDebut: {
            lte: currentDate,
          },
          dateFin: {
            gte: currentDate,
          },
        },
      });
    }
  }
  async ajouterParticipationSessionCourrante( idVendeur: number): Promise<ParticipationSession> {
    const session = await this.currentSession();
    if(!session){
      throw new NotFoundException("Il n'y a pas de session en cours");
    }
    const idSession : number = session.idSession;
    return this.prisma.participationSession.create({
      data: {
        idVendeur: idVendeur,
        idSession: idSession,
      },
    });
  }
}
