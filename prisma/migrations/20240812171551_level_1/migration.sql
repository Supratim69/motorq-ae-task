/*
  Warnings:

  - A unique constraint covering the columns `[DriverID,StartTime,EndTime]` on the table `VehicleDriverAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[VehicleID,StartTime,EndTime]` on the table `VehicleDriverAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VehicleDriverAssignment_DriverID_IsAssigned_key";

-- DropIndex
DROP INDEX "VehicleDriverAssignment_VehicleID_IsAssigned_key";

-- AlterTable
ALTER TABLE "VehicleDriverAssignment" ADD COLUMN     "EndTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "VehicleDriverAssignment" ADD COLUMN     "StartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDriverAssignment_DriverID_StartTime_EndTime_key" ON "VehicleDriverAssignment"("DriverID", "StartTime", "EndTime");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDriverAssignment_VehicleID_StartTime_EndTime_key" ON "VehicleDriverAssignment"("VehicleID", "StartTime", "EndTime");
