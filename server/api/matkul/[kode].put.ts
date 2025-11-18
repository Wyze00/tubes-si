import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kode = getRouterParam(event, "kode");
    const body = await readBody(event);

    const dataToUpdate = {
        ...body,
        SKS: parseInt(body.SKS),
    };

    const updated = await PrismaService.getInstance().matkul.update({
        where: { Kd_Matkul: kode },
        data: dataToUpdate,
    });

    return {
        message: "Data updated successfully",
        data: updated,
    };
});
