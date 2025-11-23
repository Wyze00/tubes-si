import type { Prodi } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const data: Prodi[] = await PrismaService.getInstance().prodi.findMany();

  return {
    message: "Data fetched securely",
    data: data,
  };
});
