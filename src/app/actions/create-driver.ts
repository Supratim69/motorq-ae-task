"use server";

import { PrismaClient, Driver } from "@prisma/client";

const prisma = new PrismaClient();

interface DriverInput {
    Name: string;
    Phone: string;
    Email: string;
}

export async function createDriver(
    data: DriverInput
): Promise<{ success: boolean; data: Driver }> {
    const driver = await prisma.driver.create({
        data: {
            Name: data.Name,
            Phone: data.Phone,
            Email: data.Email,
        },
    });

    return { success: true, data: driver };
}
