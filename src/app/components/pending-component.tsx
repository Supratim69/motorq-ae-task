"use client";
import React from "react";
import { acceptRequest } from "@/app/actions/accept-request";
import { rejectRequest } from "@/app/actions/reject-request";

interface PendingComponentProps {
    requestId: string;
    vehicleModel: string;
    licenseNo: string;
    startTime: string;
    endTime: string;
    onStatusChange?: () => void;
}

export default function PendingComponent({
    requestId,
    vehicleModel,
    licenseNo,
    startTime,
    endTime,
    onStatusChange,
}: PendingComponentProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        )}`;
    };

    const handleAccept = async () => {
        const result = await acceptRequest({ requestId });
        if (result.success) {
            alert(result.message);
            if (onStatusChange) onStatusChange();
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    const handleReject = async () => {
        const result = await rejectRequest({ requestId });
        if (result.success) {
            alert(result.message);
            if (onStatusChange) onStatusChange();
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    return (
        <div className="flex flex-col items-start border p-4 rounded-lg shadow-md mb-4 w-full">
            <h3 className="text-lg font-bold">
                {vehicleModel} ({licenseNo})
            </h3>
            <p className="text-sm text-gray-600">
                Start Time: {formatDate(startTime)}
            </p>
            <p className="text-sm text-gray-600">
                End Time: {formatDate(endTime)}
            </p>
            <div className="flex justify-end mt-4 space-x-2">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    onClick={handleAccept}
                >
                    Accept
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={handleReject}
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
