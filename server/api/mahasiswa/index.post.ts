import { Mahasiswa } from "@prisma/client";
import { AesService } from "~~/server/util/aesService";
import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const body: Mahasiswa = await readBody(event);

    const dataToCreate: Mahasiswa = {
        ...body,
        Nama_Mhs: AesService.encrypt(body.Nama_Mhs),
    };

    const newMahasiswa: Mahasiswa =
        await PrismaService.getInstance().mahasiswa.create({
            data: dataToCreate,
        });
    
    return {
        message: "Data created successfully",
        data: newMahasiswa,
    };
});
