/*
  Warnings:

  - You are about to drop the column `horario` on the `Agendamentos` table. All the data in the column will be lost.
  - Added the required column `horarioId` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Horarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    CONSTRAINT "Horarios_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Dias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agendamentos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "horarioId" TEXT NOT NULL,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Agendamentos_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Agendamentos_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Dias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Agendamentos_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Agendamentos" ("clientId", "confirmado", "dayId", "id") SELECT "clientId", "confirmado", "dayId", "id" FROM "Agendamentos";
DROP TABLE "Agendamentos";
ALTER TABLE "new_Agendamentos" RENAME TO "Agendamentos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
