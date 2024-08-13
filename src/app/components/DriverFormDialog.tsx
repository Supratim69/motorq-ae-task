"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import DriverForm from "./driver-form";

export default function DriverFormDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-white bg-primary rounded-lg p-2 px-3">
                New Driver
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Driver Profile</DialogTitle>
                </DialogHeader>
                <DriverForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
