import type { Prodi } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kodeProdi: string = getRouterParam(event, "kode")!;
    const body: Prodi = await readBody(event);

    const updatedNuxt: Prodi = await PrismaService.getInstance().prodi.update({
        where: {
            Kd_Prodi: kodeProdi,
        },
        data: body,
    });

    return {
        message: "Data updated successfully",
        data: updatedNuxt,
    };
});
