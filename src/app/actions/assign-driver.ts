"use server";

import { PrismaClient, VehicleDriverAssignment } from "@prisma/client";

const prisma = new PrismaClient();

interface AssignDriverInput {
    DriverID: string;
    VehicleID: string;
}

export async function assignDriver(
    data: AssignDriverInput
): Promise<{ success: boolean; data: VehicleDriverAssignment }> {
    const assignment = await prisma.vehicleDriverAssignment.create({
        data: {
            DriverID: data.DriverID,
            VehicleID: data.VehicleID,
            IsAssigned: true,
        },
    });

    return { success: true, data: assignment };
}
