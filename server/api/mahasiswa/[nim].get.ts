import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");

  const mahasiswa = await PrismaService.getInstance().mahasiswa.findUnique({
    where: { NIM: nim },
  });

  mahasiswa!.Nama_Mhs = AesService.decrypt(mahasiswa!.Nama_Mhs);

  return { data: mahasiswa };
});
