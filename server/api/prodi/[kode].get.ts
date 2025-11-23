import type { Prodi } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const kodeProdi: string = getRouterParam(event, "kode")!;

  const prodi: Prodi | null = await PrismaService.getInstance().prodi.findUnique({
    where: {
      Kd_Prodi: kodeProdi,
    },
  });

  return {
    message: "Data fetched successfully",
    data: prodi,
  };
});
