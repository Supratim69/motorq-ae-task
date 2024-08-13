import logo from "@/app/assets/logo.svg";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { PrismaClient, RequestStatus } from "@prisma/client";
import DriverFormDialog from "@/app/components/DriverFormDialog";
import DriverSearch from "./components/driver-search";
import UnassignDriverButton from "./components/unassign-driver-button";

export default async function Home() {
    const prisma = new PrismaClient();

    const vehicles = await prisma.vehicle.findMany({
        select: {
            VehicleID: true,
            LicenseNo: true,
            Model: true,
            Assignments: {
                select: {
                    Status: true,
                    Driver: {
                        select: {
                            DriverID: true,
                            Name: true,
                        },
                    },
                },
                take: 1,
            },
        },
    });

    const drivers = await prisma.driver.findMany({
        select: {
            DriverID: true,
            Name: true,
            Phone: true,
            Email: true,
            LocationName: true,
            Latitude: true,
            Longitude: true,
        },
    });

    return (
        <div className="h-screen flex flex-col justify-around items-center w-full">
            <div className="flex flex-row items-center w-full justify-around h-[10%]">
                <Image src={logo} alt="logo" />
                <span className="text-3xl font-medium">
                    Vehicle-Driver Mapping System
                </span>
                <DriverFormDialog />
            </div>
            <div className="h-[80%] max-w-[70%] min-w-[70%] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>License No.</TableHead>
                            <TableHead>Model No.</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map((vehicle) => {
                            const assignmentStatus =
                                vehicle.Assignments.length > 0
                                    ? vehicle.Assignments[0].Status
                                    : null;

                            let statusText = "Unassigned";
                            let buttonText = "Assign";
                            let buttonColor = "bg-green-500";

                            if (assignmentStatus === RequestStatus.ACCEPTED) {
                                statusText = "Assigned";
                                buttonText = "Unassign";
                                buttonColor = "bg-red-500";
                            } else if (
                                assignmentStatus === RequestStatus.PENDING
                            ) {
                                statusText = "Pending";
                                buttonText = "Pending...";
                                buttonColor = "bg-yellow-500";
                            }

                            return (
                                <TableRow key={vehicle.LicenseNo}>
                                    <TableCell className="font-medium">
                                        {vehicle.LicenseNo}
                                    </TableCell>
                                    <TableCell>{vehicle.Model}</TableCell>
                                    <TableCell>{statusText}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger
                                                className={`px-3 rounded-lg w-[35%] py-2 text-white ${buttonColor}`}
                                                disabled={
                                                    assignmentStatus ===
                                                    RequestStatus.PENDING
                                                }
                                            >
                                                {buttonText}
                                            </DialogTrigger>
                                            <DialogContent>
                                                {assignmentStatus ===
                                                RequestStatus.ACCEPTED ? (
                                                    <div>
                                                        <span className="text-lg">
                                                            Are you sure you
                                                            want to unassign the
                                                            driver?
                                                        </span>
                                                        <div className="flex flex-row justify-evenly mt-2">
                                                            <UnassignDriverButton
                                                                driverId={
                                                                    vehicle
                                                                        .Assignments[0]
                                                                        .Driver
                                                                        .DriverID
                                                                }
                                                                vehicleId={
                                                                    vehicle.VehicleID
                                                                }
                                                            />
                                                            <button className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <DialogHeader className="mb-2">
                                                            <DialogTitle>
                                                                Assign Driver.
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <DriverSearch
                                                            drivers={drivers}
                                                            vehicleId={
                                                                vehicle.VehicleID
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
