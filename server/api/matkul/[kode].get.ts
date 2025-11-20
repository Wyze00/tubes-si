import { Matkul } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const kode = getRouterParam(event, "kode");

  const matkul = await PrismaService.getInstance().matkul.findUnique({
    where: { Kd_Matkul: kode },
  });

  return { data: matkul };
});
