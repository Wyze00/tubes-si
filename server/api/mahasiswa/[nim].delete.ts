import { PrismaService } from "~~/server/util/prismaService";

export default defineEventHandler(async (event) => {
    const nim: string = getRouterParam(event, "nim")!;

    await PrismaService.getInstance().mahasiswa.delete({
        where: {
            NIM: nim,
        },
    });

    return {
        message: "Data deleted successfully",
        data: true,
    };
});
