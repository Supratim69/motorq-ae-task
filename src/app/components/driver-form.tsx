"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDriver } from "@/app/actions/create-driver";
import { useToast } from "@/components/ui/use-toast";
import MapWithPlacePicker from "@/app/components/MapWithPlacePicker";

interface DriverFormProps {
    onSuccess?: () => void;
}

export default function DriverForm({ onSuccess }: DriverFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        address: string;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createDriver({
                Name: name.trim(),
                Phone: phone.trim(),
                Email: email.trim(),
                LocationName: location!.address.trim(),
                Latitude: location!.latitude,
                Longitude: location!.longitude,
            });
            if (result.success) {
                toast({
                    className: "bg-green-500 text-white",
                    description: "Driver created successfully.",
                });
                setName("");
                setPhone("");
                setEmail("");
                setLocation(null);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            toast({
                className: "bg-red-500 text-white",
                description: "An error occurred while creating driver.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = name && phone && email && location;

    return (
        <form onSubmit={handleSubmit}>
            <div className="my-3">
                <label htmlFor="name" className="text-lg mx-1">
                    Name
                </label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Driver's Name..."
                    required
                />
            </div>
            <div className="my-3">
                <label htmlFor="phone" className="text-lg mx-1">
                    Phone
                </label>
                <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Driver's Phone..."
                    required
                    pattern="^\d{10,}$"
                    title="Phone number must have at least 10 digits"
                />
            </div>
            <div className="my-3">
                <label htmlFor="email" className="text-lg mx-1">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Enter Driver's Email..."
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="my-3">
                <label htmlFor="location" className="text-lg mx-1">
                    Location
                </label>
                <MapWithPlacePicker onLocationSelect={setLocation} />
                {location && (
                    <p className="text-green-500 text-sm mt-1">
                        Location selected: {location.address}
                    </p>
                )}
            </div>
            <Button type="submit" disabled={isSubmitting || !isFormValid}>
                {isSubmitting ? "Creating..." : "Create"}
            </Button>
        </form>
    );
}
