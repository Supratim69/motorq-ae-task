-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'INVALID';

-- CreateTable
CREATE TABLE "RequestAssignment" (
    "RequestAssignmentID" STRING NOT NULL,
    "RequestID" STRING NOT NULL,
    "DriverID" STRING NOT NULL,
    "AcceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestAssignment_pkey" PRIMARY KEY ("RequestAssignmentID")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestAssignment_RequestID_DriverID_key" ON "RequestAssignment"("RequestID", "DriverID");

-- AddForeignKey
ALTER TABLE "RequestAssignment" ADD CONSTRAINT "RequestAssignment_RequestID_fkey" FOREIGN KEY ("RequestID") REFERENCES "AssignmentRequest"("RequestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAssignment" ADD CONSTRAINT "RequestAssignment_DriverID_fkey" FOREIGN KEY ("DriverID") REFERENCES "Driver"("DriverID") ON DELETE RESTRICT ON UPDATE CASCADE;
