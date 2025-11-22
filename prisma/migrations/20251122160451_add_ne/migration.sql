/*
  Warnings:

  - Added the required column `Alamat` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Kd_Prodi` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" ADD COLUMN     "Alamat" VARCHAR(256) NOT NULL,
ADD COLUMN     "Kd_Prodi" CHAR(10) NOT NULL;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_Kd_Prodi_fkey" FOREIGN KEY ("Kd_Prodi") REFERENCES "Prodi"("Kd_Prodi") ON DELETE RESTRICT ON UPDATE CASCADE;
