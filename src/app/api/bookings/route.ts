// src/api/bookings/route.ts
import prisma from "@/lib/prisma";
import { createBooking } from "@/model/Booking"

export async function POST(request: Request) {
    try {
        const { customerId, bikeId, startTime, endTime, totalPrice, ownerId } = await request.json();

        // Get customer details
        const customer = await prisma.user.findUnique({
            where: {
                id: customerId,
            },
        });

        if (!customer) {
            return Response.json(
                {
                    success: false,
                    message: "Customer not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Check licence upload
        if (
            !customer.licenseFrontUrl ||
            !customer.licenseBackUrl
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please upload your driving licence before renting a bike.",
                },
                {
                    status: 400,
                }
            );
        }
        // Create the booking
        const booking = await createBooking({
            customerId,
            ownerId,
            bikeId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            totalPrice,
            status: "pending",
        });

        return Response.json(
            {
                success: true,
                booking
            },
            { status: 201 }
        );
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return Response.json(
            {
                success: false,
                message: "Error creating booking"
            }, { status: 500 }
        );
    }
}


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return Response.json({ success: false, message: "userId is required" }, { status: 400 });
        }

        const bookings = await prisma.booking.findMany({
            where: { customerId: parseInt(userId) },
            include: { bike: true, payment: true },
        });

        return Response.json(
            {
                success: true,
                bookings
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving rental history:", error);
        return Response.json(
            {
                success: false,
                message: "Error retrieving rental history"
            },
            { status: 500 }
        );
    }
}
