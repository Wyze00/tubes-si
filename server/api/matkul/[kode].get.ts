import type { Matkul } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const kode: string = getRouterParam(event, "kode")!;

  const matkul: Matkul | null =
    await PrismaService.getInstance().matkul.findUnique({
      where: {
        Kd_Matkul: kode,
      },
    });

  return {
    message: "Data fetched successfully",
    data: matkul,
  };
});
