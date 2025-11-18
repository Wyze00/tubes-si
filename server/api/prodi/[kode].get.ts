import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const kodeProdi = getRouterParam(event, "kode");

  const prodi = await PrismaService.getInstance().prodi.findUnique({
    where: {
      Kd_Prodi: kodeProdi,
    },
  });

  return {
    data: prodi,
  };
});
