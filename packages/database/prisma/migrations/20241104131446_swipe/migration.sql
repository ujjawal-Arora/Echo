-- CreateEnum
CREATE TYPE "relationType" AS ENUM ('LongTerm', 'ShortTerm', 'Living');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "RelationShipType" "relationType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "lookingFor" TEXT[];
