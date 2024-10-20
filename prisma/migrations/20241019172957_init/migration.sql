-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GESTIONNAIRE', 'ADMIN');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('DEPOSE', 'DISPONIBLE', 'VENDU', 'RECUPERER');

-- CreateEnum
CREATE TYPE "Etat" AS ENUM ('NEUF', 'BONNE_ETAT', 'PIECE_MANQUANTES');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "idUtilisateur" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("idUtilisateur")
);

-- CreateTable
CREATE TABLE "Vendeur" (
    "idVendeur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "sommeTotale" DECIMAL(10,2) NOT NULL,
    "sommeDue" DECIMAL(10,2) NOT NULL,
    "sommeRetire" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Vendeur_pkey" PRIMARY KEY ("idVendeur")
);

-- CreateTable
CREATE TABLE "Retrait" (
    "idRetrait" SERIAL NOT NULL,
    "somme" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idVendeur" INTEGER NOT NULL,

    CONSTRAINT "Retrait_pkey" PRIMARY KEY ("idRetrait")
);

-- CreateTable
CREATE TABLE "Session" (
    "idSession" SERIAL NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("idSession")
);

-- CreateTable
CREATE TABLE "ParticipationSession" (
    "idSession" INTEGER NOT NULL,
    "idVendeur" INTEGER NOT NULL,

    CONSTRAINT "ParticipationSession_pkey" PRIMARY KEY ("idSession","idVendeur")
);

-- CreateTable
CREATE TABLE "Jeu" (
    "idJeu" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "editeur" TEXT NOT NULL,

    CONSTRAINT "Jeu_pkey" PRIMARY KEY ("idJeu")
);

-- CreateTable
CREATE TABLE "JeuUnitaire" (
    "idJeuUnitaire" SERIAL NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,
    "statut" "Statut" NOT NULL,
    "dateAchat" TIMESTAMP(3) NOT NULL,
    "etat" "Etat" NOT NULL,
    "idVendeur" INTEGER NOT NULL,
    "idJeu" INTEGER NOT NULL,

    CONSTRAINT "JeuUnitaire_pkey" PRIMARY KEY ("idJeuUnitaire")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendeur_email_key" ON "Vendeur"("email");

-- AddForeignKey
ALTER TABLE "Retrait" ADD CONSTRAINT "Retrait_idVendeur_fkey" FOREIGN KEY ("idVendeur") REFERENCES "Vendeur"("idVendeur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationSession" ADD CONSTRAINT "ParticipationSession_idSession_fkey" FOREIGN KEY ("idSession") REFERENCES "Session"("idSession") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationSession" ADD CONSTRAINT "ParticipationSession_idVendeur_fkey" FOREIGN KEY ("idVendeur") REFERENCES "Vendeur"("idVendeur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JeuUnitaire" ADD CONSTRAINT "JeuUnitaire_idVendeur_fkey" FOREIGN KEY ("idVendeur") REFERENCES "Vendeur"("idVendeur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JeuUnitaire" ADD CONSTRAINT "JeuUnitaire_idJeu_fkey" FOREIGN KEY ("idJeu") REFERENCES "Jeu"("idJeu") ON DELETE RESTRICT ON UPDATE CASCADE;
