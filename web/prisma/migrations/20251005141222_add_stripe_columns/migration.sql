-- AlterTable
ALTER TABLE "public"."repasse_logs" ADD COLUMN     "confirmed_at" TIMESTAMP(3),
ADD COLUMN     "connected_account_id" TEXT,
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "smart_contract_id" TEXT;

-- CreateTable
CREATE TABLE "public"."stripe_connected_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "stripe_user_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "livemode" BOOLEAN NOT NULL DEFAULT false,
    "capabilities" JSONB,
    "charges_enabled" BOOLEAN NOT NULL DEFAULT false,
    "transfers_enabled" BOOLEAN NOT NULL DEFAULT false,
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_sync_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_connected_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_monitoring_data" (
    "id" TEXT NOT NULL,
    "connected_account_id" TEXT NOT NULL,
    "period" DATE NOT NULL,
    "mrr" DECIMAL(15,2),
    "churn_rate" DECIMAL(5,4),
    "new_customers" INTEGER,
    "total_charges" DECIMAL(15,2),
    "total_refunds" DECIMAL(15,2),
    "disputes_count" INTEGER,
    "raw_data" JSONB,
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_monitoring_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_webhook_events" (
    "id" TEXT NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),
    "error_message" TEXT,
    "event_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_connected_accounts_stripe_user_id_key" ON "public"."stripe_connected_accounts"("stripe_user_id");

-- CreateIndex
CREATE INDEX "stripe_connected_accounts_user_id_user_type_idx" ON "public"."stripe_connected_accounts"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "stripe_connected_accounts_stripe_user_id_idx" ON "public"."stripe_connected_accounts"("stripe_user_id");

-- CreateIndex
CREATE INDEX "stripe_monitoring_data_connected_account_id_period_idx" ON "public"."stripe_monitoring_data"("connected_account_id", "period" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_monitoring_data_connected_account_id_period_key" ON "public"."stripe_monitoring_data"("connected_account_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_webhook_events_stripe_event_id_key" ON "public"."stripe_webhook_events"("stripe_event_id");

-- CreateIndex
CREATE INDEX "stripe_webhook_events_event_type_processed_idx" ON "public"."stripe_webhook_events"("event_type", "processed");

-- CreateIndex
CREATE INDEX "stripe_webhook_events_stripe_event_id_idx" ON "public"."stripe_webhook_events"("stripe_event_id");

-- CreateIndex
CREATE INDEX "repasse_logs_smart_contract_id_status_idx" ON "public"."repasse_logs"("smart_contract_id", "status");

-- CreateIndex
CREATE INDEX "repasse_logs_connected_account_id_idx" ON "public"."repasse_logs"("connected_account_id");

-- AddForeignKey
ALTER TABLE "public"."repasse_logs" ADD CONSTRAINT "repasse_logs_connected_account_id_fkey" FOREIGN KEY ("connected_account_id") REFERENCES "public"."stripe_connected_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasse_logs" ADD CONSTRAINT "repasse_logs_smart_contract_id_fkey" FOREIGN KEY ("smart_contract_id") REFERENCES "public"."smart_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stripe_monitoring_data" ADD CONSTRAINT "stripe_monitoring_data_connected_account_id_fkey" FOREIGN KEY ("connected_account_id") REFERENCES "public"."stripe_connected_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
