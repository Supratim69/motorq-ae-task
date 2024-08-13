"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Driver } from "@prisma/client";
import DriverAssignmentButton from "@/app/components/driver-assignment-button";

interface Props {
    drivers: Driver[];
    vehicleId: string;
}

export default function DriverSearch({ drivers, vehicleId }: Props) {
    const [step, setStep] = useState(1);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredList, setFilteredList] = useState<Driver[]>(drivers);

    // Optional: Re-enable the search functionality if needed
    // const fuse = new Fuse(drivers, {
    //     keys: ["Name", "Phone"],
    //     threshold: 0.3,
    // });

    // useEffect(() => {
    //     if (searchTerm) {
    //         const results = fuse.search(searchTerm);
    //         setFilteredList(results.map((result) => result.item));
    //     } else {
    //         setFilteredList(drivers);
    //     }
    // }, [searchTerm, drivers]);

    const handleNextClick = () => {
        if (!startTime || !endTime) {
            alert("Please select both start and end times.");
            return;
        }
        setStep(2);
    };

    const handleBackClick = () => {
        setStep(1);
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <div className="mb-4">
                        <label className="block">
                            <span className="font-extrabold">Start Time:</span>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block w-full mt-1 border p-1 rounded-lg"
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block">
                            <span className="font-extrabold">End Time:</span>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block w-full mt-1  border p-1 rounded-lg"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-primary p-2 px-3 rounded-lg text-white"
                            onClick={handleNextClick}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <Input
                        type="text"
                        placeholder="Search driver..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="overflow-y-auto h-[20vh] flex flex-col">
                        {filteredList.map((driver) => (
                            <DriverAssignmentButton
                                key={driver.DriverID}
                                driver={driver}
                                vehicleId={vehicleId}
                                startTime={startTime}
                                endTime={endTime}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-primary p-2 px-3 rounded-lg text-white"
                            onClick={handleBackClick}
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
