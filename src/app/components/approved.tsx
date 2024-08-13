import React from "react";
import ApprovedComponent from "@/app/components/approved-component";
import { PrismaClient, RequestStatus } from "@prisma/client";

interface ApprovedRequestsProps {
    driverID: string;
}

export default async function ApprovedAssignments({
    driverID,
}: ApprovedRequestsProps) {
    const prisma = new PrismaClient();

    const approvedAssignments = await prisma.assignmentRequest.findMany({
        where: {
            DriverID: driverID,
            Status: RequestStatus.ACCEPTED,
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

    if (approvedAssignments.length === 0) {
        return (
            <div className="h-[80vh] w-[30vw] flex items-center justify-center">
                Nothing to see here
            </div>
        );
    }

    return (
        <div className="h-[80vh] w-[30vw] overflow-y-auto">
            {approvedAssignments.map((assignment) => (
                <ApprovedComponent
                    key={assignment.AssignmentID}
                    vehicleModel={assignment.Vehicle.Model}
                    licenseNo={assignment.Vehicle.LicenseNo}
                    startTime={assignment.Assignment.StartTime.toISOString()}
                    endTime={assignment.Assignment.EndTime.toISOString()}
                />
            ))}
        </div>
    );
}
