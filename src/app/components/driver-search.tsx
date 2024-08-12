"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Driver } from "@prisma/client";
import Fuse from "fuse.js";
import DriverAssignmentButton from "@/app/components/driver-assignment-button";

interface Props {
    drivers: Driver[];
    vehicleId: string;
}

export default function DriverSearch({ drivers, vehicleId }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredList, setFilteredList] = useState<Driver[]>(drivers);

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

    return (
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
                    />
                ))}
            </div>
        </div>
    );
}
