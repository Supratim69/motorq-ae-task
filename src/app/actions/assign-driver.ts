"use server";

import {
    PrismaClient,
    VehicleDriverAssignment,
    RequestStatus,
} from "@prisma/client";
import calculateDistance from "@/utils/distance";

const prisma = new PrismaClient();

interface AssignDriverInput {
    DriverIDs: string[];
    VehicleID: string;
    StartTime: Date;
    EndTime: Date;
    Latitude: number;
    Longitude: number;
}

export async function assignDriver(data: AssignDriverInput): Promise<{
    success: boolean;
    data?: VehicleDriverAssignment[];
    message?: string;
}> {
    const assignments: VehicleDriverAssignment[] = [];
    try {
        for (const DriverID of data.DriverIDs) {
            const conflictingDriverAssignment =
                await prisma.vehicleDriverAssignment.findFirst({
                    where: {
                        DriverID: DriverID,
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
                    message: `Driver ${DriverID} is already assigned to another vehicle within the selected timeframe.`,
                };
            }

            // const conflictingVehicleAssignment =
            //     await prisma.vehicleDriverAssignment.findFirst({
            //         where: {
            //             VehicleID: data.VehicleID,
            //             StartTime: {
            //                 lte: data.EndTime,
            //             },
            //             EndTime: {
            //                 gte: data.StartTime,
            //             },
            //         },
            //     });

            // if (conflictingVehicleAssignment) {
            //     return {
            //         success: false,
            //         message: `Vehicle ${data.VehicleID} is already assigned to another driver within the selected timeframe.`,
            //     };
            // }

            const driver = await prisma.driver.findUnique({
                where: {
                    DriverID: DriverID,
                },
                select: {
                    Latitude: true,
                    Longitude: true,
                },
            });

            if (!driver) {
                return {
                    success: false,
                    message: `Driver ${DriverID} not found.`,
                };
            }

            const distance = calculateDistance(
                data.Latitude,
                data.Longitude,
                driver.Latitude!,
                driver.Longitude!
            );

            const radiusLimit = 10;

            if (distance > radiusLimit) {
                return {
                    success: false,
                    message: `Driver ${DriverID} is outside the acceptable radius for assignment.`,
                };
            }

            const result = await prisma.$transaction(async (prisma) => {
                const assignment = await prisma.vehicleDriverAssignment.create({
                    data: {
                        DriverID: DriverID,
                        VehicleID: data.VehicleID,
                        StartTime: data.StartTime,
                        EndTime: data.EndTime,
                        Status: RequestStatus.PENDING,
                    },
                });

                await prisma.assignmentRequest.create({
                    data: {
                        DriverID: DriverID,
                        VehicleID: data.VehicleID,
                        AssignmentID: assignment.AssignmentID,
                        Status: RequestStatus.PENDING,
                    },
                });

                return assignment;
            });

            assignments.push(result);
        }

        return { success: true, data: assignments };
    } catch (error) {
        console.error("Error assigning driver to vehicle:", error);
        return {
            success: false,
            message:
                "An error occurred while assigning the driver(s) to the vehicle.",
        };
    }
}
