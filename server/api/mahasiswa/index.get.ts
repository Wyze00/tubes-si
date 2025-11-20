import { PrismaService } from "~~/server/util/prismaService";
import { AesService } from "../../util/aesService";

export default defineEventHandler(async (event) => {
  const data = await PrismaService.getInstance().mahasiswa.findMany();

  data.forEach((mahasiswa) => {
    mahasiswa.Nama_mhs = AesService.decrypt(mahasiswa.Nama_mhs);
  })

  return {
    message: "Success fetch data",
    data: data,
  };
});
