import React from "react";

interface ApprovedComponentProps {
    vehicleModel: string;
    licenseNo: string;
    startTime: string;
    endTime: string;
}

export default function ApprovedComponent({
    vehicleModel,
    licenseNo,
    startTime,
    endTime,
}: ApprovedComponentProps) {
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

    return (
        <div className="border p-4 rounded-lg shadow-md mb-4 w-full max-w-md mx-auto bg-green-50">
            <h3 className="text-lg font-bold">
                {vehicleModel} ({licenseNo})
            </h3>
            <p className="text-sm text-gray-600">
                Start Time: {formatDate(startTime)}
            </p>
            <p className="text-sm text-gray-600">
                End Time: {formatDate(endTime)}
            </p>
        </div>
    );
}
