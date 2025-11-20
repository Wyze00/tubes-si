import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
  const data = await PrismaService.getInstance().mahasiswa.findMany();

  return {
    message: "Success fetch data",
    data: data,
  };
});
