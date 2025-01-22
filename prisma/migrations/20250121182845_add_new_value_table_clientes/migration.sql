/*
  Warnings:

  - Added the required column `senha` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Clientes" ("email", "id", "name") SELECT "email", "id", "name" FROM "Clientes";
DROP TABLE "Clientes";
ALTER TABLE "new_Clientes" RENAME TO "Clientes";
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
