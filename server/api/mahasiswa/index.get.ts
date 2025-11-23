import { PrismaService } from "~~/server/util/prismaService";
import { AesService } from "../../util/aesService";
import type { Mahasiswa } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const data: Mahasiswa[] = await PrismaService.getInstance().mahasiswa.findMany();

  data.forEach((mahasiswa: Mahasiswa) => {
    mahasiswa.Nama_Mhs = AesService.decrypt(mahasiswa.Nama_Mhs);
  });

  return {
    message: "Success fetch data",
    data: data,
  };
});
