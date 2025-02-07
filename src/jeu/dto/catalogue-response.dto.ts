export class CatalogueResponseDto {
  totalPages: number;
  nbJeux: number;
  items: CatalogueItemResponseDto[];
}
export class CatalogueItemResponseDto {

  id: number;

  nom: string;

  description: string;

  editeur: string;

  prix : number;

  prenomVendeur: string;

  nomVendeur: string;

  image: string; // Add the image attribute

  etat: string; // Add the statut attribute

  // Add other properties as needed
}