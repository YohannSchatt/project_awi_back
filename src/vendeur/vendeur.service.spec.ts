import { Test, TestingModule } from '@nestjs/testing';
import { VendeurService } from './vendeur.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service'; // Assurez-vous d'importer votre SessionService
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Etat, Statut } from '@prisma/client';
import Decimal from 'decimal.js';

describe('VendeurService', () => {
  let service: VendeurService;
  let prisma: PrismaService;
  let sessionService: SessionService; // Ajouter une référence au SessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendeurService,
        {
          provide: PrismaService,
          useValue: {
            vendeur: {
              findUnique: jest.fn(),
            },
            jeuUnitaire: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            // Mock des méthodes spécifiques utilisées dans vos tests
            someMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VendeurService>(VendeurService);
    prisma = module.get<PrismaService>(PrismaService);
    sessionService = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enregistrerRetraitJeu', () => {
    it('should throw NotFoundException if vendeur is not found', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(null);

      await expect(service.enregistrerRetraitJeu(1, [1, 2, 3])).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if jeuUnitaire is not found', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)});

      jest.spyOn(prisma.jeuUnitaire, 'findMany').mockResolvedValue([]);

      await expect(service.enregistrerRetraitJeu(1, [1, 2, 3])).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if jeuUnitaire status is not DISPONIBLE or DEPOSE', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)});

      jest.spyOn(prisma.jeuUnitaire, 'findMany').mockResolvedValue([
        {idVendeur : 1,idJeu : 1 ,  idJeuUnitaire: 1, statut: Statut.VENDU, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.BONNE_ETAT,},
        {idVendeur : 1,idJeu : 2 ,  idJeuUnitaire: 2, statut: Statut.DISPONIBLE, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.NEUF,},
      ]);

      await expect(service.enregistrerRetraitJeu(1, [1, 2])).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if jeuUnitaire does not belong to the vendeur', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)});

      jest.spyOn(prisma.jeuUnitaire, 'findMany').mockResolvedValue([
        {idVendeur : 1,idJeu : 1 ,  idJeuUnitaire: 1, statut: Statut.DISPONIBLE, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.BONNE_ETAT,},
        {idVendeur : 2,idJeu : 2 ,  idJeuUnitaire: 2, statut: Statut.DISPONIBLE, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.NEUF,},
      ]);

      await expect(service.enregistrerRetraitJeu(1, [1, 2])).rejects.toThrow(BadRequestException);
    });

    it('should update jeuUnitaire status to RECUPERER', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)});

      jest.spyOn(prisma.jeuUnitaire, 'findMany').mockResolvedValue([
        {idVendeur : 1,idJeu : 1 ,  idJeuUnitaire: 1, statut: Statut.DEPOSE, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.BONNE_ETAT,},
        {idVendeur : 1,idJeu : 2 ,  idJeuUnitaire: 2, statut: Statut.DISPONIBLE, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.NEUF,},
      ]);

      const updateManySpy = jest.spyOn(prisma.jeuUnitaire, 'updateMany').mockResolvedValue({ count: 2 });

      await service.enregistrerRetraitJeu(1, [1, 2]);

      expect(updateManySpy).toHaveBeenCalledWith({
        where: { idJeuUnitaire: { in: [1, 2] } },
        data: { statut: Statut.RECUPERER },
      });
    });
  });
});