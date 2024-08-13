"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Driver } from "@prisma/client";
import { filterDrivers } from "@/app/actions/filter-drivers";
import { assignDriver } from "@/app/actions/assign-driver";
import Fuse from "fuse.js";
import { useToast } from "@/components/ui/use-toast";
import MapWithPlacePicker from "./MapWithPlacePicker";

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
    const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]); // State to track selected drivers
    const [fuse, setFuse] = useState<Fuse<Driver> | null>(null);
    const { toast } = useToast();

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

    const handleDriverSelect = (driverId: string) => {
        const isSelected = selectedDrivers.includes(driverId);
        const updatedSelection = isSelected
            ? selectedDrivers.filter((id) => id !== driverId)
            : [...selectedDrivers, driverId];

        setSelectedDrivers(updatedSelection);
    };

    const handleAssign = async () => {
        if (selectedDrivers.length === 0) {
            return;
        }

        try {
            const result = await assignDriver({
                DriverIDs: selectedDrivers,
                VehicleID: vehicleId,
                StartTime: new Date(startTime),
                EndTime: new Date(endTime),
                Latitude: location!.latitude,
                Longitude: location!.longitude,
            });

            if (result.success) {
                toast({
                    title: "Drivers Assigned",
                    description: `Selected drivers have been assigned to the vehicle from ${startTime} to ${endTime}.`,
                });
                setSelectedDrivers([]); // Clear the selection after assignment
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description:
                        result.message ||
                        "Failed to assign drivers to vehicle.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to assign drivers to vehicle.",
            });
            console.error("Error assigning drivers:", error);
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
                    <div className="overflow-y-auto h-[30vh] flex flex-col">
                        {filteredList.length > 0 ? (
                            filteredList.map((driver) => (
                                <div
                                    key={driver.DriverID}
                                    className="flex items-center w-full "
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDrivers.includes(
                                            driver.DriverID
                                        )}
                                        onChange={() =>
                                            handleDriverSelect(driver.DriverID)
                                        }
                                        className="mr-2 cur"
                                    />
                                    <div className="flex flex-row justify-around w-full border rounded-lg  my-3 py-2">
                                        <span>{driver.Name}</span>
                                        <span>{driver.Phone}</span>
                                        <span className="text-green-500">
                                            Available
                                        </span>
                                    </div>
                                </div>
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
                        <button
                            className="bg-primary p-2 px-3 rounded-lg text-white"
                            onClick={handleAssign}
                            disabled={selectedDrivers.length === 0}
                        >
                            Assign
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
