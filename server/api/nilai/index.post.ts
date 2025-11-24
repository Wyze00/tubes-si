import type { Nilai } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const body: Nilai = await readBody(event);

  console.log(body);

  const newNilai: Nilai = await PrismaService.getInstance().nilai.create({
    data: {
      NIM: body.NIM,
      Kd_Matkul: body.Kd_Matkul,
      Nilai: AesService.encrypt(body.Nilai),
      Grade: AesService.encrypt(body.Grade),
    },
  });

  return {
    message: "Grade added successfully",
    data: newNilai,
  };
});
