import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const nim = getRouterParam(event, "nim");
    const body = await readBody(event);

    const dataToUpdate = {
        ...body,
        : parseInt(body.SKS),
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
