import { Test, TestingModule } from '@nestjs/testing';
import { VendeurController } from './vendeur.controller';
import { VendeurService } from './vendeur.service';
import { CreateVendeurDto } from './dto/create-vendeur.dto';
import { Vendeur } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateVendeurDto } from './dto/update-vendeur.dto';
import Decimal from 'decimal.js';
import { EnregistrerRetraitJeuDto } from './dto/enregistrer-retrait-jeu.dto';
import { Statut, Etat } from '@prisma/client';

describe('VendeurController', () => {
  let controller: VendeurController;
  let service: VendeurService;

  const mockVendeurService = {
    createVendeur: jest.fn(),
    updateVendeur: jest.fn(),
    enregistrerRetraitJeu: jest.fn(),
    enregistrerRetraitArgent: jest.fn(),
    getArgentVendeur: jest.fn(),
    getListVendeur: jest.fn(),
    // Vous pouvez ajouter d'autres méthodes mock si nécessaire
  };

  const mockResponse = {
    status : jest.fn().mockReturnThis(),
    send: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendeurController],
      providers: [
        {
          provide: VendeurService,
          useValue: mockVendeurService,
        },
      ],
    }).compile();

    controller = module.get<VendeurController>(VendeurController);
    service = module.get<VendeurService>(VendeurService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createVendeur', () => {
    it('should create a vendeur and return it', async () => {
      const createVendeurDto: CreateVendeurDto = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        numero: '987654321',
        // Ajoutez d'autres propriétés requises par CreateVendeurDto
      };

      const mockVendeur: Vendeur = {
        idVendeur: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        numero: '987654321',
        sommeTotale: new Decimal(0),
        sommeRetire: new Decimal(0),
        sommeDue: new Decimal(0),
      };

      mockVendeurService.createVendeur.mockResolvedValue(mockVendeur);

      const result = await controller.createVendeur(createVendeurDto);

      expect(service.createVendeur).toHaveBeenCalledWith(createVendeurDto);
      expect(result).toEqual(mockVendeur);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createVendeurDto: CreateVendeurDto = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        numero: '987654321',
      };

      mockVendeurService.createVendeur.mockRejectedValue(() => {
        throw new BadRequestException('Erreur lors de la création du vendeur');
      });

      await expect(controller.createVendeur(createVendeurDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.createVendeur).toHaveBeenCalledWith(createVendeurDto);
    });
  });

  describe('updateVendeur', () => {
    it("should update a vendeur and return it", async () => {
      const updateVendeurDto: UpdateVendeurDto = {
        idVendeur: 1,
        prenom: 'Marie',
        nom: 'Curie',
        email: 'marie.curie@example.com',
        numero: '123456789',
      };

      const mockUpdatedVendeur: Vendeur = {
        idVendeur: 1,
        prenom: 'Marie',
        nom: 'Curie',
        email: 'marie.curie@example.com',
        numero: '123456789',
        sommeTotale: new Decimal(100),
        sommeRetire: new Decimal(50),
        sommeDue: new Decimal(50),
      };

      mockVendeurService.updateVendeur.mockRejectedValue(
        new BadRequestException('Erreur lors de la mise à jour du vendeur'),
      );

      mockVendeurService.updateVendeur.mockResolvedValue(mockUpdatedVendeur);

      const result = await controller.updateVendeur(updateVendeurDto);

      expect(service.updateVendeur).toHaveBeenCalledWith(updateVendeurDto);
      expect(result).toEqual(mockUpdatedVendeur);
    })
    it('should throw BadRequestException if update fails', async () => {
      const updateVendeurDto: UpdateVendeurDto = {
        idVendeur: 1,
        prenom: 'Marie',
        nom: 'Curie',
        email: 'marie.curie@example.com',
        numero: '123456789',
      };

      mockVendeurService.updateVendeur.mockRejectedValue(
        new BadRequestException('Erreur lors de la mise à jour du vendeur'),
      );

      await expect(controller.updateVendeur(updateVendeurDto)).rejects.toThrow(
        BadRequestException,
      );
  
      expect(service.updateVendeur).toHaveBeenCalledWith(updateVendeurDto);
    })
  })

  describe("enregistrerRetraitJeuArgent", () => {
    it("should return 'Retrait effectué' if withdrawal is successful", async () => {
      const enregistrerRetraitJeuDto : EnregistrerRetraitJeuDto = {
        idVendeur: 1,
        idJeu: [1,2],
        argent: true,
      };

      mockVendeurService.enregistrerRetraitJeu.mockResolvedValue({idVendeur : 1,idJeu : 2 ,  idJeuUnitaire: 2, statut: Statut.RECUPERER, prix : new Decimal(0), dateAchat : new Date(), etat : Etat.NEUF,});
      mockVendeurService.enregistrerRetraitArgent.mockResolvedValue({ idVendeur: 1 , prenom : "toto", nom : "toto" , email : "toto@example.com", numero : "123456789", sommeTotale : new Decimal(0), sommeRetire : new Decimal(0), sommeDue : new Decimal(12.34)});

      const result = await controller.enregistrerRetraitJeu(mockResponse, enregistrerRetraitJeuDto);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith('Retrait effectué');
    });

    it("should throw BadRequestException if no game or money is selected", async () => {
      const enregistrerRetraitJeuDto : EnregistrerRetraitJeuDto = {
        idVendeur: 1,
        idJeu: [],
        argent: false,
      };

      await controller.enregistrerRetraitJeu(mockResponse, enregistrerRetraitJeuDto)

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith("Vous devez choisir un jeu ou de l'argent à retirer");
    });
  })

  describe("getArgentVendeur", () => {
    it("should return the amount of money owed to the seller", async () => {
      const getArgentDto = { idVendeur: 1 };

      mockVendeurService.getArgentVendeur.mockResolvedValue(12.34);

      const result = await controller.getArgentVendeur(getArgentDto);

      expect(service.getArgentVendeur).toHaveBeenCalledWith(getArgentDto.idVendeur);
      expect(result).toEqual(12.34);
    });

    it("should throw NotFoundException if the seller is not found", async () => {
      const getArgentDto = { idVendeur: 1 };

      mockVendeurService.getArgentVendeur.mockRejectedValue(
        new NotFoundException('Vendeur non trouvé'),
      );

      await expect(controller.getArgentVendeur(getArgentDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(service.getArgentVendeur).toHaveBeenCalledWith(getArgentDto.idVendeur);
    });
  })

  describe("getListVendeur", () => {
    it("should return a list of sellers", async () => {
      const mockVendeur: Vendeur = {
        idVendeur: 1,
        prenom: 'Marie',
        nom: 'Curie',
        email: 'marie.curie@example.com',
        numero: '123456789',
        sommeTotale: new Decimal(100),
        sommeRetire: new Decimal(50),
        sommeDue: new Decimal(50),
      };

      mockVendeurService.getListVendeur.mockResolvedValue(mockVendeur);

      const result = await controller.getListVendeur({nom: 'Curie', prenom: 'Marie', email: 'marie.curie@example.com', numero: '123456789'});

      expect(result).toEqual(mockVendeur);

    })
  })
});