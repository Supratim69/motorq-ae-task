"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { createDriver } from "@/app/actions/create-driver";
import { useToast } from "@/components/ui/use-toast";

export default function DriverForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
    const { toast } = useToast();

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: "", phone: "", email: "" };

        if (!name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }
        if (!phone.trim()) {
            newErrors.phone = "Phone is required";
            isValid = false;
        } else if (!/^\d{10,}$/.test(phone)) {
            newErrors.phone = "Phone number must have at least 10 digits";
            isValid = false;
        }
        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const result = await createDriver({
                Name: name,
                Phone: phone,
                Email: email,
            });
            if (result.success) {
                toast({
                    className: "bg-green-500 text-white",
                    description: "Driver created successfully.",
                });
                setName("");
                setPhone("");
                setEmail("");
                setErrors({ name: "", phone: "", email: "" });
            }
        } catch (error) {
            toast({
                className: "bg-red-500 text-white",
                description: "An error occurred while creating driver.",
            });
        }
    };

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
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
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
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>
            <Button type="submit">Create</Button>
        </form>
    );
}
