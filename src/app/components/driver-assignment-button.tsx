"use client";

import React from "react";
import { assignDriver } from "@/app/actions/assign-driver";
import { useToast } from "@/components/ui/use-toast";

interface DriverAssignmentButtonProps {
    driver: {
        DriverID: string;
        Name: string;
        Phone: string;
    };
    vehicleId: string;
    startTime: string;
    endTime: string;
}

const DriverAssignmentButton: React.FC<DriverAssignmentButtonProps> = ({
    driver,
    vehicleId,
    startTime,
    endTime,
}) => {
    const { toast } = useToast();

    const handleAssign = async () => {
        try {
            const result = await assignDriver({
                DriverID: driver.DriverID,
                VehicleID: vehicleId,
                StartTime: new Date(startTime),
                EndTime: new Date(endTime),
            });

            if (result.success) {
                toast({
                    title: "Driver Assigned",
                    description: `${driver.Name} has been assigned to the vehicle from ${startTime} to ${endTime}.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description:
                        result.message || "Failed to assign driver to vehicle.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to assign driver to vehicle.",
            });
            console.error("Error assigning driver:", error);
        }
    };

    return (
        <button
            className="border my-2 hover:bg-gray-300 py-2 rounded-lg w-full flex flex-row justify-around"
            onClick={handleAssign}
        >
            <span>{driver.Name}</span>
            <span>{driver.Phone}</span>
        </button>
    );
};

export default DriverAssignmentButton;
