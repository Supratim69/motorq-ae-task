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
        // Find the assignment request by ID with related Assignment
        const request = await prisma.assignmentRequest.findUnique({
            where: {
                RequestID: data.requestId,
            },
            include: {
                Assignment: true,
            },
        });

        // Check if the request exists, is pending, and not yet accepted
        if (!request || request.Status !== RequestStatus.PENDING) {
            return {
                success: false,
                message: "Request has already been processed.",
            };
        }

        await prisma.$transaction(async (prisma) => {
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

            // Invalidate other pending requests for the same vehicle and overlapping times
            await prisma.assignmentRequest.updateMany({
                where: {
                    VehicleID: request.Assignment.VehicleID,
                    // Ensure that the requests selected are overlapping and pending
                    AND: [
                        {
                            OR: [
                                {
                                    Assignment: {
                                        StartTime: {
                                            lt: request.Assignment.EndTime,
                                        },
                                    },
                                },
                                {
                                    Assignment: {
                                        EndTime: {
                                            gt: request.Assignment.StartTime,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            Status: RequestStatus.PENDING,
                        },
                    ],
                    NOT: {
                        RequestID: data.requestId, // Exclude the current request from being invalidated
                    },
                },
                data: {
                    Status: RequestStatus.INVALID,
                },
            });
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
