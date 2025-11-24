import { Nilai } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");
  const kode = getRouterParam(event, "kode");
  const body = await readBody(event);

  if (!nim || !kode) {
    throw createError({ statusCode: 400, statusMessage: "Missing parameters" });
  }

  const updatedNilai: Nilai = await PrismaService.getInstance().nilai.update({
    where: {
      NIM_Kd_Matkul: {
        NIM: nim,
        Kd_Matkul: kode,
      },
    },
    data: {
      Nilai: AesService.encrypt(body.Nilai),
      Grade: AesService.encrypt(body.Grade),
    },
  });

  return {
    message: "Grade updated successfully",
    data: updatedNilai,
  };
});
