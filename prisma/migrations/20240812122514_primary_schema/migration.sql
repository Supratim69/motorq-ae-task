-- CreateTable
CREATE TABLE "Driver" (
    "DriverID" STRING NOT NULL,
    "Name" STRING NOT NULL,
    "Email" STRING NOT NULL,
    "Phone" STRING NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("DriverID")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "VehicleID" STRING NOT NULL,
    "Company" STRING NOT NULL,
    "Model" STRING NOT NULL,
    "LicenseNo" STRING NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("VehicleID")
);

-- CreateTable
CREATE TABLE "VehicleDriverAssignment" (
    "AssignmentID" STRING NOT NULL,
    "IsAssigned" BOOL NOT NULL DEFAULT false,
    "DriverID" STRING NOT NULL,
    "VehicleID" STRING NOT NULL,

    CONSTRAINT "VehicleDriverAssignment_pkey" PRIMARY KEY ("AssignmentID")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDriverAssignment_DriverID_IsAssigned_key" ON "VehicleDriverAssignment"("DriverID", "IsAssigned");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDriverAssignment_VehicleID_IsAssigned_key" ON "VehicleDriverAssignment"("VehicleID", "IsAssigned");

-- AddForeignKey
ALTER TABLE "VehicleDriverAssignment" ADD CONSTRAINT "VehicleDriverAssignment_DriverID_fkey" FOREIGN KEY ("DriverID") REFERENCES "Driver"("DriverID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDriverAssignment" ADD CONSTRAINT "VehicleDriverAssignment_VehicleID_fkey" FOREIGN KEY ("VehicleID") REFERENCES "Vehicle"("VehicleID") ON DELETE RESTRICT ON UPDATE CASCADE;
