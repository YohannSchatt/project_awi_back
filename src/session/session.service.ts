import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParticipationSession } from '@prisma/client';
import { SessionDto } from './dto/response-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { titre, lieu, dateDebut, dateFin, description } = createSessionDto;

    // Convert string dates to Date objects
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);

    const DateValid = await this.VerifyDate(dateDebutObj, dateFinObj);
    // Verify that the session dates are correct
    if (!DateValid) {
      throw new BadRequestException('Les dates de la session sont incorrectes');
    }
    // Create the session in the database
    const session = await this.prisma.session.create({
      data: {
        titre: titre,
        lieu: lieu,
        dateDebut: dateDebutObj,
        dateFin: dateFinObj,
        description: description,
      },
    });

    return session;
  }

  async update(updateSessionDto: UpdateSessionDto) {
    const { id, titre, lieu, dateDebut, dateFin, description } = updateSessionDto;

    const data: any = {};

    if (dateDebut !== undefined && dateFin !== undefined) {
      
      // Convert string dates to Date objects
      const dateDebutObj = new Date(dateDebut);
      const dateFinObj = new Date(dateFin);
      const DateValid = await this.VerifyDate(dateDebutObj, dateFinObj,id);
      // Verify that the session dates are correct
      if (!DateValid) {
        throw new BadRequestException('Les dates de la session sont incorrectes');
      }

      if (dateDebutObj !== undefined) data.dateDebut = dateDebutObj;
      if (dateFinObj !== undefined) data.dateFin = dateFinObj;
    }

    // Build the data object dynamically
    if (titre !== undefined) data.titre = titre;
    if (lieu !== undefined) data.lieu = lieu;
    if (description !== undefined) data.description = description;

    // Update the session in the database
    const session = await this.prisma.session.update({
      where: {
        idSession: id,
      },
      data: data,
    });

    return session;
  }

  async getActualSession() {
    return await this.prisma.session.findFirst({
      where: {
        AND: [
          {
            dateDebut: {
              lte: new Date(),
            },
          },
          {
            dateFin: {
              gte: new Date(),
            },
          },
        ],
      },
    });
  }

  async getNextSession() {
    return this.prisma.session.findMany({
      orderBy: {
        dateDebut: 'asc',
      },
      where: {
        dateDebut: {
          gte: new Date(),
        },
      },
    });
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

  private async VerifyDate(dateDebut: Date, dateFin: Date, id?: number): Promise<boolean> {
    if (dateDebut > dateFin || dateDebut < new Date()) {
      return false;
    }

    const overlappingSession = await this.prisma.session.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                dateDebut: {
                  lte: dateFin,
                },
                dateFin: {
                  gte: dateDebut,
                },
              },
              {
                dateDebut: {
                  lte: dateDebut,
                },
                dateFin: {
                  gte: dateFin,
                },
              },
            ],
          },
          id ? { idSession: { not: id } } : {},
        ],
      },
    });
    return !overlappingSession;
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async delete(id : number) {
    const session = await this.prisma.session.delete({
      where: {
        idSession: id,
      },
    });
    if (!session) {
      throw new NotFoundException("La session n'existe pas");
    }
    return session;

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
