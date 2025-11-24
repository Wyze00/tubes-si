import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const nim = getRouterParam(event, "nim");
  const kode = getRouterParam(event, "kode");

  await PrismaService.getInstance().nilai.delete({
    where: {
      NIM_Kd_Matkul: {
        NIM: nim!,
        Kd_Matkul: kode!,
      },
    },
  });

  return {
    message: "Grade deleted successfully",
    data: true,
  };
});
