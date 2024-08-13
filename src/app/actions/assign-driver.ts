"use server";

import {
    PrismaClient,
    VehicleDriverAssignment,
    RequestStatus,
} from "@prisma/client";
import calculateDistance from "@/utils/distance";

const prisma = new PrismaClient();

interface AssignDriverInput {
    DriverID: string;
    VehicleID: string;
    StartTime: Date;
    EndTime: Date;
    Latitude: number;
    Longitude: number;
}

export async function assignDriver(data: AssignDriverInput): Promise<{
    success: boolean;
    data?: VehicleDriverAssignment;
    message?: string;
}> {
    try {
        // Step 1: Checking for existing assignments for the driver within the same timeframe
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

        // Step 2: Checking for existing assignments for the vehicle within the same timeframe
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

        // Step 3: Verify that the driver is within the required distance (e.g., 10 km radius)
        const driver = await prisma.driver.findUnique({
            where: {
                DriverID: data.DriverID,
            },
            select: {
                Latitude: true,
                Longitude: true,
            },
        });

        if (!driver) {
            return {
                success: false,
                message: "Driver not found.",
            };
        }

        const distance = calculateDistance(
            data.Latitude,
            data.Longitude,
            driver.Latitude!,
            driver.Longitude!
        );

        const radiusLimit = 10; // radius in kilometers

        if (distance > radiusLimit) {
            return {
                success: false,
                message:
                    "Driver is outside the acceptable radius for assignment.",
            };
        }

        // Step 4: If no conflicts, create the assignment and the request in a transaction
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
