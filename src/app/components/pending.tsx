import React from "react";
import PendingComponent from "@/app/components/pending-component";
import { PrismaClient, RequestStatus } from "@prisma/client";

interface PendingRequestsProps {
    driverID: string;
}

export default async function PendingRequests({
    driverID,
}: PendingRequestsProps) {
    const prisma = new PrismaClient();

    const pendingRequests = await prisma.assignmentRequest.findMany({
        where: {
            DriverID: driverID,
            Status: RequestStatus.PENDING,
        },
        include: {
            Vehicle: {
                select: {
                    Model: true,
                    LicenseNo: true,
                },
            },
            Assignment: {
                select: {
                    StartTime: true,
                    EndTime: true,
                },
            },
        },
    });

    return (
        <div className="h-[80vh] w-[30vw] overflow-y-auto">
            {pendingRequests.map((request) => (
                <PendingComponent
                    key={request.RequestID}
                    requestId={request.RequestID}
                    vehicleModel={request.Vehicle.Model}
                    licenseNo={request.Vehicle.LicenseNo}
                    startTime={request.Assignment.StartTime.toISOString()}
                    endTime={request.Assignment.EndTime.toISOString()}
                />
            ))}
        </div>
    );
}
