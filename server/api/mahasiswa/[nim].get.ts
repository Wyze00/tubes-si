import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");

  const mahasiswa = await PrismaService.getInstance().mahasiswa.findUnique({
    where: { NIM: nim },
  });

  return { data: mahasiswa };
});
