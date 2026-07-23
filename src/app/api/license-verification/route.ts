import prisma from "@/lib/prisma";

export async function GET() {

    const users = await prisma.user.findMany({

        where: {
            role: "customer",
            licenseFrontUrl: {
                not: null,
            },
            licenseBackUrl: {
                not: null,
            },
        },

        orderBy: {
            createdAt: "desc",
        },

    });

    return Response.json({
        success: true,
        users,
    });

}