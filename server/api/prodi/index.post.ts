import type { Prodi } from "@prisma/client";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const body: Prodi = await readBody(event);

    const newProdi: Prodi = await PrismaService.getInstance().prodi.create({
        data: body,
    });

    return {
        message: "Data created successfully",
        data: newProdi,
    };
});
