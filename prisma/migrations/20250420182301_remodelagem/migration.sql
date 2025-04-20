/*
  Warnings:

  - You are about to drop the column `dayId` on the `Agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `horarioId` on the `Agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `dayId` on the `Horarios` table. All the data in the column will be lost.
  - Added the required column `cabeleleiroId` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diasHorariosId` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicosId` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Cabeleleiros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Vazio'
);

-- CreateTable
CREATE TABLE "cabeleleiro_has_Disponibilidade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cabeleleiroId" TEXT NOT NULL,
    "diasHorariosId" TEXT NOT NULL,
    CONSTRAINT "cabeleleiro_has_Disponibilidade_cabeleleiroId_fkey" FOREIGN KEY ("cabeleleiroId") REFERENCES "Cabeleleiros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cabeleleiro_has_Disponibilidade_diasHorariosId_fkey" FOREIGN KEY ("diasHorariosId") REFERENCES "Dias_has_Horarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servicos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoServicoId" TEXT NOT NULL,
    "cabeleleiroId" TEXT NOT NULL,
    CONSTRAINT "Servicos_tipoServicoId_fkey" FOREIGN KEY ("tipoServicoId") REFERENCES "TipoServico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Servicos_cabeleleiroId_fkey" FOREIGN KEY ("cabeleleiroId") REFERENCES "Cabeleleiros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TipoServico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "Preco" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Dias_has_Horarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "horarioId" TEXT NOT NULL,
    CONSTRAINT "Dias_has_Horarios_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Dias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dias_has_Horarios_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agendamentos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "cabeleleiroId" TEXT NOT NULL,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "diasHorariosId" TEXT NOT NULL,
    "servicosId" TEXT NOT NULL,
    CONSTRAINT "Agendamentos_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Agendamentos_cabeleleiroId_fkey" FOREIGN KEY ("cabeleleiroId") REFERENCES "Cabeleleiros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Agendamentos_diasHorariosId_fkey" FOREIGN KEY ("diasHorariosId") REFERENCES "Dias_has_Horarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Agendamentos_servicosId_fkey" FOREIGN KEY ("servicosId") REFERENCES "Servicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Agendamentos" ("clientId", "confirmado", "id") SELECT "clientId", "confirmado", "id" FROM "Agendamentos";
DROP TABLE "Agendamentos";
ALTER TABLE "new_Agendamentos" RENAME TO "Agendamentos";
CREATE TABLE "new_Horarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "livre" BOOLEAN NOT NULL DEFAULT true,
    "horario" TEXT NOT NULL
);
INSERT INTO "new_Horarios" ("horario", "id", "livre") SELECT "horario", "id", "livre" FROM "Horarios";
DROP TABLE "Horarios";
ALTER TABLE "new_Horarios" RENAME TO "Horarios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
