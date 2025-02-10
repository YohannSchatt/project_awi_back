import { Test, TestingModule } from '@nestjs/testing';
import { VendeurService } from './vendeur.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service'; // Assurez-vous d'importer votre SessionService
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Etat, Statut } from '@prisma/client';
import Decimal from 'decimal.js';
import { create } from 'domain';

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
              findMany: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
            jeuUnitaire: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
            },
            retrait : {
              create : jest.fn(),
            }
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

  describe('createVendeur', () => {
    it('should throw NotFoundException if vendeur with email already exists', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)});

      await expect(service.createVendeur({ prenom: 'toto', nom: 'titi', email: "toto@example.com", numero: "123456789"})).rejects.toThrow(NotFoundException);
    })

    it("should create a new vendeur", async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.vendeur, 'create').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(0)})
      
      await expect(service.createVendeur({ prenom: 'toto', nom: 'titi', email: "toto@example.com", numero: "123456789"}))
    })
  });

  describe("getArgentVendeur", () => {
    it("should throw NotFoundException if vendeur is not found", async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(null);

      await expect(service.getArgentVendeur(1)).rejects.toThrow(NotFoundException);
    });

    it("should return the vendeur's sommeDue", async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "titi" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)});

      expect(await service.getArgentVendeur(1)).toBe(12.34);
    })
  });

  describe("getListVendeur", () => {

    it("should return all vendeur", async () => {
    jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue([
      { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      { idVendeur: 1 , prenom : "titi", nom : "titi" , email : "titi@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      { idVendeur: 1 , prenom : "tata", nom : "tata" , email : "tata@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)}])

    expect(await service.getListVendeur("","","","")).toEqual([
      { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      { idVendeur: 1 , prenom : "titi", nom : "titi" , email : "titi@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      { idVendeur: 1 , prenom : "tata", nom : "tata" , email : "tata@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)}]);
    });

    it("should return vendeur with a similar name", async () => {

      const mockedVendeurs = [
        { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      ];
      
      jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue(mockedVendeurs);

      const result = await service.getListVendeur("tot", "", "", "");

        const expected = mockedVendeurs.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        const transformedResult = result.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        expect(transformedResult).toEqual(expected);
    })

    it("should return vendeur with a similar firstname", async () => {

      const mockedVendeurs = [
        { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      ];
      
      jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue(mockedVendeurs);

      const result = await service.getListVendeur("", "tot", "", "");

        const expected = mockedVendeurs.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        const transformedResult = result.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        expect(transformedResult).toEqual(expected);
    })

    it("should return vendeur with a similar email", async () => {

      const mockedVendeurs = [
        { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      ];
      
      jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue(mockedVendeurs);

      const result = await service.getListVendeur("", "", "toto@example.c", "");

        const expected = mockedVendeurs.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        const transformedResult = result.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        expect(transformedResult).toEqual(expected);
    })

    it("should return vendeur with a similar numero", async () => {

      const mockedVendeurs = [
        { idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)},
      ];
      
      jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue(mockedVendeurs);

      const result = await service.getListVendeur("", "", "", "123456789");

        const expected = mockedVendeurs.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        const transformedResult = result.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        expect(transformedResult).toEqual(expected);
    })

    it("should return vendeur with a similar numero", async () => {

      const mockedVendeurs = [];
      
      jest.spyOn(prisma.vendeur, 'findMany').mockResolvedValue(mockedVendeurs);

      const result = await service.getListVendeur("zgzegz", "ioze", "rgro", "030303");

        const expected = mockedVendeurs.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        const transformedResult = result.map(vendeur => ({
          ...vendeur,
          sommeTotale: vendeur.sommeTotale.toNumber(),
          sommeRetire: vendeur.sommeRetire.toNumber(),
          sommeDue: vendeur.sommeDue.toNumber(),
        }));
  
        expect(transformedResult).toEqual(expected);
    })
  });

  describe("enregistrerRetraitArgent", () => {
    it('should throw NotFoundException if vendeur is not found', async () => {
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(null);

      await expect(service.enregistrerRetraitArgent(1)).rejects.toThrow(NotFoundException);
    });

    it('should update the vendeur solde', async () => {
      const mockedVendeur = { 
        idVendeur: 1, 
        prenom: "toto", 
        nom: "toto", 
        email: "toto@example.com", 
        numero: "123456789", 
        sommeTotale: new Decimal(0), 
        sommeRetire: new Decimal(0), 
        sommeDue: new Decimal(12.34) 
      };
    
      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(mockedVendeur);
      jest.spyOn(prisma.vendeur, 'update').mockResolvedValue({
        ...mockedVendeur,
        sommeDue: new Decimal(0),
        sommeRetire: mockedVendeur.sommeRetire.plus(mockedVendeur.sommeDue),
      });
    
      const result = await service.enregistrerRetraitArgent(1);
    
      expect(result.sommeDue.toNumber()).toBe(0);
      expect(result.sommeRetire.toNumber()).toBe(12.34);
    });
  });

  describe("updateVendeur", () => {
    it('should throw NotFoundException if vendeur is not found', async () => {

      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(null);

      await expect(service.updateVendeur({idVendeur : 1, nom : "Daniel"})).rejects.toThrow(NotFoundException);
    });

    it("should update the vendeur's information", async () => {
      const mockedVendeur = { 
        idVendeur: 1, 
        prenom: "toto", 
        nom: "toto", 
        email: "toto@example.com", 
        numero: "123456789", 
        sommeTotale: new Decimal(0), 
        sommeRetire: new Decimal(0), 
        sommeDue: new Decimal(12.34) 
      };

      jest.spyOn(prisma.vendeur, 'findUnique').mockResolvedValue(mockedVendeur);

      jest.spyOn(prisma.vendeur, 'update').mockResolvedValue({
        ...mockedVendeur,
        nom: "Daniel"
      });

      const result = await service.updateVendeur({idVendeur : 1, nom : "Daniel"});

      expect(result.nom).toBe("Daniel");
    })
  });

});