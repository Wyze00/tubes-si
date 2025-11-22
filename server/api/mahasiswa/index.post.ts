import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const dataToCreate = {
        ...body,
        Nama_Mhs: AesService.encrypt(body.Nama_Mhs),
    };

    const newMahasiswa = await PrismaService.getInstance().mahasiswa.create({
        data: dataToCreate,
    });

    return {
        message: "Data created successfully",
        data: newMahasiswa,
    };
});
