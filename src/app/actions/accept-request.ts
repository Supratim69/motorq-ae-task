"use server";

import { PrismaClient, RequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface AcceptRequestInput {
    requestId: string;
}

export async function acceptRequest(data: AcceptRequestInput): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Find the assignment request by ID
        const request = await prisma.assignmentRequest.findUnique({
            where: {
                RequestID: data.requestId,
            },
            include: {
                Assignment: true,
            },
        });

        // Check if the request exists and is pending
        if (!request || request.Status !== RequestStatus.PENDING) {
            return {
                success: false,
                message: "Request not found or has already been processed.",
            };
        }

        // Update the request status to ACCEPTED
        await prisma.assignmentRequest.update({
            where: {
                RequestID: data.requestId,
            },
            data: {
                Status: RequestStatus.ACCEPTED,
            },
        });

        // Update the corresponding VehicleDriverAssignment status to ACCEPTED
        await prisma.vehicleDriverAssignment.update({
            where: {
                AssignmentID: request.AssignmentID,
            },
            data: {
                Status: RequestStatus.ACCEPTED,
            },
        });

        return {
            success: true,
            message: "Request has been accepted successfully.",
        };
    } catch (error) {
        console.error("Error accepting request:", error);
        return {
            success: false,
            message: "An error occurred while accepting the request.",
        };
    }
}
