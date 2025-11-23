import type { Matkul } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const dataToCreate: Matkul = {
        ...body,
        SKS: parseInt(body.SKS),
    };

    const newMatkul: Matkul = await PrismaService.getInstance().matkul.create({
        data: dataToCreate,
    });

    return {
        message: "Data created successfully",
        data: newMatkul,
    };
});
