import { Mahasiswa } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const kode = getRouterParam(event, "kode");
    const body = await readBody(event) as Mahasiswa;

    const dataToUpdate = {
        ...body,
        Nama_Mhs: AesService.encrypt(body.Nama_Mhs)
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