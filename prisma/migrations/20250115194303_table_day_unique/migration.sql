/*
  Warnings:

  - A unique constraint covering the columns `[day]` on the table `Dias` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dias_day_key" ON "Dias"("day");
