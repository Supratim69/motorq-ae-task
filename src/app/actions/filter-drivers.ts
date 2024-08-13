"use server";
import calculateDistance from "@/utils/distance";
import { PrismaClient } from "@prisma/client";

interface FilterDriversParams {
    latitude: number;
    longitude: number;
    startTime: Date;
    endTime: Date;
    maxDistance?: number;
}

const prisma = new PrismaClient();

export async function filterDrivers({
    latitude,
    longitude,
    startTime,
    endTime,
    maxDistance = 10,
}: FilterDriversParams) {
    const drivers = await prisma.driver.findMany();

    const availableDrivers = [];

    for (const driver of drivers) {
        if (driver.Latitude !== undefined && driver.Longitude !== undefined) {
            const distance = calculateDistance(
                latitude,
                longitude,
                driver.Latitude,
                driver.Longitude
            );

            if (distance <= maxDistance) {
                const conflictingAssignmentsOrRequests =
                    await prisma.vehicleDriverAssignment.findMany({
                        where: {
                            DriverID: driver.DriverID,
                            OR: [
                                {
                                    StartTime: {
                                        lte: endTime,
                                    },
                                    EndTime: {
                                        gte: startTime,
                                    },
                                },
                            ],
                            AssignmentRequest: {
                                some: {
                                    Status: "PENDING",
                                },
                            },
                        },
                    });

                if (conflictingAssignmentsOrRequests.length === 0) {
                    availableDrivers.push(driver);
                }
            }
        } else {
            console.warn(`Driver ${driver.Name} is missing location data.`);
        }
    }

    return availableDrivers;
}
