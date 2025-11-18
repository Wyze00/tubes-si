import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kode = getRouterParam(event, "kode");

    await PrismaService.getInstance().matkul.delete({
        where: { Kd_Matkul: kode },
    });

    return {
        message: "Data deleted successfully",
        data: true,
    };
});
