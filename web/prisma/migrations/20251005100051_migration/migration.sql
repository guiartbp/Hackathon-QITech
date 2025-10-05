-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TOMADOR', 'INVESTIDOR');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'TOMADOR',
ALTER COLUMN "emailVerified" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
