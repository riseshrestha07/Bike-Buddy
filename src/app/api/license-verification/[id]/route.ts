import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await request.json();

        const user = await prisma.user.update({
            where: {
                id: Number(params.id),
            },
            data: {
                licenseStatus: status,
                licenseVerifiedAt:
                    status === "APPROVED"
                        ? new Date()
                        : null,
            },
        });

        return Response.json({
            success: true,
            user,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to update licence status",
            },
            { status: 500 }
        );
    }
}