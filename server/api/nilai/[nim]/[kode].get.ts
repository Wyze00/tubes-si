import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");
  const kode = getRouterParam(event, "kode");

  const data = await PrismaService.getInstance().nilai.findUnique({
    where: {
      NIM_Kd_Matkul: {
        NIM: nim!,
        Kd_Matkul: kode!,
      },
    },
    include: {
      Matkul: true,
    },
  });

  data!.Nilai = AesService.decrypt(data!.Nilai);
  data!.Grade = AesService.decrypt(data!.Grade);

  return {
    message: "Success fetch data",
    data: data,
  };
});
