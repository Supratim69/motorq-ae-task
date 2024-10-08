"use server";

import { PrismaClient, RequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface UnassignDriverInput {
    DriverID: string;
    VehicleID: string;
}

export async function unassignDriver(
    data: UnassignDriverInput
): Promise<{ success: boolean; message: string }> {
    const assignment = await prisma.vehicleDriverAssignment.findFirst({
        where: {
            DriverID: data.DriverID,
            VehicleID: data.VehicleID,
            Status: RequestStatus.ACCEPTED,
        },
    });

    if (!assignment) {
        return {
            success: false,
            message: "Assignment not found or already unassigned.",
        };
    }

    await prisma.vehicleDriverAssignment.update({
        where: {
            AssignmentID: assignment.AssignmentID,
        },
        data: {
            Status: RequestStatus.REJECTED,
        },
    });

    return { success: true, message: "Driver unassigned successfully." };
}
