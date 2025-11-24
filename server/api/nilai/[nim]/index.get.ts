import { Nilai } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");

  const data: Nilai[] = await PrismaService.getInstance().nilai.findMany({
    where: {
      NIM: nim,
    },
    include: {
      Matkul: true,
    },
  });

  data.forEach((item) => {
    item.Nilai = AesService.decrypt(item.Nilai);
    item.Grade = AesService.decrypt(item.Grade);
  });

  return {
    message: "Success fetch data",
    data: data,
  };
});
