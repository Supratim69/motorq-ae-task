"use client";

import React from "react";
import { unassignDriver } from "@/app/actions/unassign-driver";
import { useToast } from "@/components/ui/use-toast";

interface UnassignDriverButtonProps {
    driverId: string;
    vehicleId: string;
}

const UnassignDriverButton: React.FC<UnassignDriverButtonProps> = ({
    driverId,
    vehicleId,
}) => {
    const { toast } = useToast();

    const handleUnassign = async () => {
        try {
            const result = await unassignDriver({
                DriverID: driverId,
                VehicleID: vehicleId,
            });

            if (result.success) {
                toast({
                    title: "Driver Unassigned",
                    description: result.message,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to unassign driver from vehicle.",
            });
            console.error("Error unassigning driver:", error);
        }
    };

    return (
        <button
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
            onClick={handleUnassign}
        >
            Yes
        </button>
    );
};

export default UnassignDriverButton;
