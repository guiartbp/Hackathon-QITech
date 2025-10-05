/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "repasses" ADD COLUMN     "connected_account_id" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "user_type" TEXT,
ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "connected_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_user_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "livemode" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connected_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repasse_logs" (
    "id" TEXT NOT NULL,
    "repasse_id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "stripe_transfer_id" TEXT,
    "smart_contract_tx_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repasse_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_contracts" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "network_id" TEXT NOT NULL,
    "deploy_tx_hash" TEXT NOT NULL,
    "tomador_id" TEXT NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smart_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_signatures" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "signature_tx_hash" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "percentage" DECIMAL(5,4) NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connected_accounts_stripe_user_id_key" ON "connected_accounts"("stripe_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "smart_contracts_contract_address_key" ON "smart_contracts"("contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "investor_signatures_contract_id_investor_id_key" ON "investor_signatures"("contract_id", "investor_id");

-- AddForeignKey
ALTER TABLE "repasses" ADD CONSTRAINT "repasses_connected_account_id_fkey" FOREIGN KEY ("connected_account_id") REFERENCES "connected_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repasse_logs" ADD CONSTRAINT "repasse_logs_repasse_id_fkey" FOREIGN KEY ("repasse_id") REFERENCES "repasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_signatures" ADD CONSTRAINT "investor_signatures_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "smart_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
