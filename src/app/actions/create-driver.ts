"use server";

import { PrismaClient, Driver } from "@prisma/client";

const prisma = new PrismaClient();

interface DriverInput {
    Name: string;
    Phone: string;
    Email: string;
    LocationName: string;
    Latitude: number;
    Longitude: number;
}

export async function createDriver(
    data: DriverInput
): Promise<{ success: boolean; data: Driver }> {
    const driver = await prisma.driver.create({
        data: {
            Name: data.Name,
            Phone: data.Phone,
            Email: data.Email,
            LocationName: data.LocationName,
            Latitude: data.Latitude,
            Longitude: data.Longitude,
        },
    });

    return { success: true, data: driver };
}
