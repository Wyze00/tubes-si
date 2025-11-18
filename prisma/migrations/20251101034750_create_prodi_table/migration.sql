-- CreateTable
CREATE TABLE "Prodi" (
    "Kd_Prodi" CHAR(10) NOT NULL,
    "Nama_Prodi" VARCHAR(50) NOT NULL,
    "Fakultas" VARCHAR(50) NOT NULL,
    "Nama_KetuaProdi" VARCHAR(50),

    CONSTRAINT "Prodi_pkey" PRIMARY KEY ("Kd_Prodi")
);
