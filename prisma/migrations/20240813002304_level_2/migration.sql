-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "AssignmentRequest" (
    "RequestID" STRING NOT NULL,
    "DriverID" STRING NOT NULL,
    "VehicleID" STRING NOT NULL,
    "AssignmentID" STRING NOT NULL,
    "Status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentRequest_pkey" PRIMARY KEY ("RequestID")
);

-- AddForeignKey
ALTER TABLE "AssignmentRequest" ADD CONSTRAINT "AssignmentRequest_DriverID_fkey" FOREIGN KEY ("DriverID") REFERENCES "Driver"("DriverID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentRequest" ADD CONSTRAINT "AssignmentRequest_VehicleID_fkey" FOREIGN KEY ("VehicleID") REFERENCES "Vehicle"("VehicleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentRequest" ADD CONSTRAINT "AssignmentRequest_AssignmentID_fkey" FOREIGN KEY ("AssignmentID") REFERENCES "VehicleDriverAssignment"("AssignmentID") ON DELETE RESTRICT ON UPDATE CASCADE;
