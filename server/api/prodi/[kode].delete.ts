import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kodeProdi = getRouterParam(event, "kode");

    await PrismaService.getInstance().prodi.delete({
        where: { Kd_Prodi: kodeProdi },
    });

    return {
        message: "Data deleted successfully",
        data: true,
    };
});
