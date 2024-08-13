/*
  Warnings:

  - You are about to drop the column `IsAssigned` on the `VehicleDriverAssignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VehicleDriverAssignment" DROP COLUMN "IsAssigned";
ALTER TABLE "VehicleDriverAssignment" ADD COLUMN     "Status" "RequestStatus" NOT NULL DEFAULT 'PENDING';
