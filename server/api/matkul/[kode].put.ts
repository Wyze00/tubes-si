import type { Matkul } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kode: string = getRouterParam(event, "kode")!;
    const body = await readBody(event);

    const dataToUpdate: Matkul = {
        ...body,
        SKS: parseInt(body.SKS),
    };

    const updated: Matkul = await PrismaService.getInstance().matkul.update({
        where: {
            Kd_Matkul: kode,
        },
        data: dataToUpdate,
    });

    return {
        message: "Data updated successfully",
        data: updated,
    };
});
