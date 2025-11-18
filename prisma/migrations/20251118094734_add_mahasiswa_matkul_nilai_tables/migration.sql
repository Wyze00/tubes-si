-- CreateTable
CREATE TABLE "Mahasiswa" (
    "NIM" CHAR(7) NOT NULL,
    "Nama_Mhs" VARCHAR(256) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("NIM")
);

-- CreateTable
CREATE TABLE "Matkul" (
    "Kd_Matkul" VARCHAR(10) NOT NULL,
    "Nama_Matkul" VARCHAR(50) NOT NULL,
    "SKS" INTEGER NOT NULL,

    CONSTRAINT "Matkul_pkey" PRIMARY KEY ("Kd_Matkul")
);

-- CreateTable
CREATE TABLE "Nilai" (
    "NIM" CHAR(7) NOT NULL,
    "Kd_Matkul" VARCHAR(10) NOT NULL,
    "Nilai" VARCHAR(256) NOT NULL,
    "Grade" VARCHAR(256) NOT NULL,

    CONSTRAINT "Nilai_pkey" PRIMARY KEY ("NIM","Kd_Matkul")
);

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_NIM_fkey" FOREIGN KEY ("NIM") REFERENCES "Mahasiswa"("NIM") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_Kd_Matkul_fkey" FOREIGN KEY ("Kd_Matkul") REFERENCES "Matkul"("Kd_Matkul") ON DELETE RESTRICT ON UPDATE CASCADE;
