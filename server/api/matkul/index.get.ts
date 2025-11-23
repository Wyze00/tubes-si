import type { Matkul } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const data: Matkul[] = await PrismaService.getInstance().matkul.findMany();

  return {
    message: "Success fetch data",
    data: data,
  };
});
