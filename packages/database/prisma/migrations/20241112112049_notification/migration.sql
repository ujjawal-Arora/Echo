-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requests" TEXT[],
ADD COLUMN     "sentRequests" TEXT[];
