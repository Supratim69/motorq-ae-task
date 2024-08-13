"use server";

import {
    PrismaClient,
    VehicleDriverAssignment,
    RequestStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

interface AssignDriverInput {
    DriverID: string;
    VehicleID: string;
    StartTime: Date;
    EndTime: Date;
}

export async function assignDriver(data: AssignDriverInput): Promise<{
    success: boolean;
    data?: VehicleDriverAssignment;
    message?: string;
}> {
    try {
        // Checking for existing assignments for the driver within the same timeframe
        const conflictingDriverAssignment =
            await prisma.vehicleDriverAssignment.findFirst({
                where: {
                    DriverID: data.DriverID,
                    StartTime: {
                        lte: data.EndTime,
                    },
                    EndTime: {
                        gte: data.StartTime,
                    },
                },
            });

        if (conflictingDriverAssignment) {
            return {
                success: false,
                message:
                    "Driver is already assigned to another vehicle within the selected timeframe.",
            };
        }

        // Checking for existing assignments for the vehicle within the same timeframe
        const conflictingVehicleAssignment =
            await prisma.vehicleDriverAssignment.findFirst({
                where: {
                    VehicleID: data.VehicleID,
                    StartTime: {
                        lte: data.EndTime,
                    },
                    EndTime: {
                        gte: data.StartTime,
                    },
                },
            });

        if (conflictingVehicleAssignment) {
            return {
                success: false,
                message:
                    "Vehicle is already assigned to another driver within the selected timeframe.",
            };
        }

        // If no conflicts, create the assignment and the request in a transaction
        return await prisma.$transaction(async (prisma) => {
            // Create the VehicleDriverAssignment with status PENDING
            const assignment = await prisma.vehicleDriverAssignment.create({
                data: {
                    DriverID: data.DriverID,
                    VehicleID: data.VehicleID,
                    StartTime: data.StartTime,
                    EndTime: data.EndTime,
                    Status: RequestStatus.PENDING, // Initial status is PENDING
                },
            });

            // Create the AssignmentRequest
            const request = await prisma.assignmentRequest.create({
                data: {
                    DriverID: data.DriverID,
                    VehicleID: data.VehicleID,
                    AssignmentID: assignment.AssignmentID,
                    Status: RequestStatus.PENDING,
                },
            });

            return { success: true, data: assignment };
        });
    } catch (error) {
        console.error("Error assigning driver to vehicle:", error);
        return {
            success: false,
            message:
                "An error occurred while assigning the driver to the vehicle.",
        };
    }
}
