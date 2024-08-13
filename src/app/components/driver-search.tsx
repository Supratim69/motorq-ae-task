"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Driver } from "@prisma/client";
import DriverAssignmentButton from "@/app/components/driver-assignment-button";
import MapWithPlacePicker from "./MapWithPlacePicker";
import { filterDrivers } from "@/app/actions/filter-drivers";
import Fuse from "fuse.js";

interface Props {
    drivers: Driver[];
    vehicleId: string;
}

export default function DriverSearch({ drivers, vehicleId }: Props) {
    const [step, setStep] = useState(1);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        address: string;
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredList, setFilteredList] = useState<Driver[]>([]);
    const [originalList, setOriginalList] = useState<Driver[]>([]);
    const [fuse, setFuse] = useState<Fuse<Driver> | null>(null);

    useEffect(() => {
        const fetchFilteredDrivers = async () => {
            if (location && startTime && endTime) {
                try {
                    const availableDrivers = await filterDrivers({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        startTime: new Date(startTime),
                        endTime: new Date(endTime),
                    });
                    setFilteredList(availableDrivers);
                    setOriginalList(availableDrivers); // Keep a copy of the original list
                    setFuse(
                        new Fuse(availableDrivers, {
                            keys: ["Name", "Phone"],
                        })
                    );
                } catch (error) {
                    console.error("Error filtering drivers:", error);
                }
            }
        };

        fetchFilteredDrivers();
    }, [location, startTime, endTime]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        if (fuse && value.length > 0) {
            const results = fuse.search(value);
            const items = results.map((result) => result.item);
            setFilteredList(items);
        } else {
            setFilteredList(originalList);
        }
    };

    const handleNextClick = () => {
        if (step === 1 && (!startTime || !endTime)) {
            alert("Please select both start and end times.");
            return;
        }
        if (step === 2 && !location) {
            alert("Please select a location.");
            return;
        }
        setStep(step + 1);
    };

    const handleBackClick = () => {
        setStep(step - 1);
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
                                className="block w-full mt-1 border p-1 rounded-lg"
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
                    <MapWithPlacePicker onLocationSelect={setLocation} />
                    {location && (
                        <p className="text-green-600 mt-2">
                            Selected: {location.address}
                        </p>
                    )}
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-primary p-2 px-3 rounded-lg text-white"
                            onClick={handleBackClick}
                        >
                            Back
                        </button>
                        <button
                            className="bg-primary p-2 px-3 rounded-lg text-white"
                            onClick={handleNextClick}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <Input
                        type="text"
                        placeholder="Search driver..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="overflow-y-auto h-[20vh] flex flex-col">
                        {filteredList.length > 0 ? (
                            filteredList.map((driver) => (
                                <DriverAssignmentButton
                                    key={driver.DriverID}
                                    driver={driver}
                                    vehicleId={vehicleId}
                                    startTime={startTime}
                                    endTime={endTime}
                                />
                            ))
                        ) : (
                            <span className="my-2">No drivers available.</span>
                        )}
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
