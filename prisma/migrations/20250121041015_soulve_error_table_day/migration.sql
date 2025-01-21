/*
  Warnings:

  - You are about to drop the column `livre` on the `Dias` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" DATETIME NOT NULL
);
INSERT INTO "new_Dias" ("day", "id") SELECT "day", "id" FROM "Dias";
DROP TABLE "Dias";
ALTER TABLE "new_Dias" RENAME TO "Dias";
CREATE UNIQUE INDEX "Dias_day_key" ON "Dias"("day");
CREATE TABLE "new_Horarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "livre" BOOLEAN NOT NULL DEFAULT true,
    "horario" TEXT NOT NULL,
    CONSTRAINT "Horarios_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Dias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Horarios" ("dayId", "horario", "id") SELECT "dayId", "horario", "id" FROM "Horarios";
DROP TABLE "Horarios";
ALTER TABLE "new_Horarios" RENAME TO "Horarios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
