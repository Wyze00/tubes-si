import type { Mahasiswa } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const nim: string = getRouterParam(event, "nim")!;
    const body: Mahasiswa = await readBody(event);

    const dataToUpdate: Mahasiswa = {
        ...body,
        Nama_Mhs: AesService.encrypt(body.Nama_Mhs),
    };

    const updated: Mahasiswa = await PrismaService.getInstance().mahasiswa.update({
        where: {
            NIM: nim,
        },
        data: dataToUpdate,
    });

    return {
        message: "Data updated successfully",
        data: updated,
    };
});
