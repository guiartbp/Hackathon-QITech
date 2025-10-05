/*
  Warnings:

  - The primary key for the `audit_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cohorts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contratos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dados_bancarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `empresas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `evolucao_metricas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `historico_financeiro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `insights` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `investidores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `investimentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `metricas_mensais` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `metricas_tempo_real` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mrr_por_plano` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pagamentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projecoes_pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `propostas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `repasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `score_categorias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `score_features` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `score_recomendacoes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `scores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tomadores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `top_clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "public"."WalletTransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'RETURN', 'PIX_DEPOSIT', 'PIX_WITHDRAWAL');

-- CreateEnum
CREATE TYPE "public"."WalletTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."cohorts" DROP CONSTRAINT "cohorts_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."contratos" DROP CONSTRAINT "contratos_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."contratos" DROP CONSTRAINT "contratos_proposta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."empresas" DROP CONSTRAINT "empresas_tomador_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."evolucao_metricas" DROP CONSTRAINT "evolucao_metricas_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."historico_financeiro" DROP CONSTRAINT "historico_financeiro_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."insights" DROP CONSTRAINT "insights_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."investimentos" DROP CONSTRAINT "investimentos_contrato_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."investimentos" DROP CONSTRAINT "investimentos_investidor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."investimentos" DROP CONSTRAINT "investimentos_proposta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."metricas_mensais" DROP CONSTRAINT "metricas_mensais_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."metricas_tempo_real" DROP CONSTRAINT "metricas_tempo_real_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mrr_por_plano" DROP CONSTRAINT "mrr_por_plano_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pagamentos" DROP CONSTRAINT "pagamentos_contrato_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projecoes_pagamento" DROP CONSTRAINT "projecoes_pagamento_contrato_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."propostas" DROP CONSTRAINT "propostas_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repasses" DROP CONSTRAINT "repasses_investidor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repasses" DROP CONSTRAINT "repasses_investimento_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repasses" DROP CONSTRAINT "repasses_pagamento_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."score_categorias" DROP CONSTRAINT "score_categorias_score_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."score_features" DROP CONSTRAINT "score_features_score_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."score_recomendacoes" DROP CONSTRAINT "score_recomendacoes_score_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."scores" DROP CONSTRAINT "scores_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."top_clientes" DROP CONSTRAINT "top_clientes_empresa_id_fkey";

-- AlterTable
ALTER TABLE "public"."audit_log" DROP CONSTRAINT "audit_log_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "entidade_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "audit_log_id_seq";

-- AlterTable
ALTER TABLE "public"."cohorts" DROP CONSTRAINT "cohorts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cohorts_id_seq";

-- AlterTable
ALTER TABLE "public"."contratos" DROP CONSTRAINT "contratos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "proposta_id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ALTER COLUMN "ultima_metrica_mensal_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contratos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contratos_id_seq";

-- AlterTable
ALTER TABLE "public"."dados_bancarios" DROP CONSTRAINT "dados_bancarios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "dados_bancarios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "dados_bancarios_id_seq";

-- AlterTable
ALTER TABLE "public"."empresas" DROP CONSTRAINT "empresas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tomador_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "empresas_id_seq";

-- AlterTable
ALTER TABLE "public"."evolucao_metricas" DROP CONSTRAINT "evolucao_metricas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "evolucao_metricas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "evolucao_metricas_id_seq";

-- AlterTable
ALTER TABLE "public"."historico_financeiro" DROP CONSTRAINT "historico_financeiro_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "historico_financeiro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "historico_financeiro_id_seq";

-- AlterTable
ALTER TABLE "public"."insights" DROP CONSTRAINT "insights_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "insights_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "insights_id_seq";

-- AlterTable
ALTER TABLE "public"."investidores" DROP CONSTRAINT "investidores_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "investidores_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "investidores_id_seq";

-- AlterTable
ALTER TABLE "public"."investimentos" DROP CONSTRAINT "investimentos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "proposta_id" SET DATA TYPE TEXT,
ALTER COLUMN "contrato_id" SET DATA TYPE TEXT,
ALTER COLUMN "investidor_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "investimentos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "investimentos_id_seq";

-- AlterTable
ALTER TABLE "public"."metricas_mensais" DROP CONSTRAINT "metricas_mensais_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "metricas_mensais_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "metricas_mensais_id_seq";

-- AlterTable
ALTER TABLE "public"."metricas_tempo_real" DROP CONSTRAINT "metricas_tempo_real_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "metricas_tempo_real_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "metricas_tempo_real_id_seq";

-- AlterTable
ALTER TABLE "public"."mrr_por_plano" DROP CONSTRAINT "mrr_por_plano_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mrr_por_plano_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "mrr_por_plano_id_seq";

-- AlterTable
ALTER TABLE "public"."pagamentos" DROP CONSTRAINT "pagamentos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contrato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pagamentos_id_seq";

-- AlterTable
ALTER TABLE "public"."projecoes_pagamento" DROP CONSTRAINT "projecoes_pagamento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contrato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projecoes_pagamento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projecoes_pagamento_id_seq";

-- AlterTable
ALTER TABLE "public"."propostas" DROP CONSTRAINT "propostas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "propostas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "propostas_id_seq";

-- AlterTable
ALTER TABLE "public"."repasses" DROP CONSTRAINT "repasses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pagamento_id" SET DATA TYPE TEXT,
ALTER COLUMN "investimento_id" SET DATA TYPE TEXT,
ALTER COLUMN "investidor_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "repasses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "repasses_id_seq";

-- AlterTable
ALTER TABLE "public"."score_categorias" DROP CONSTRAINT "score_categorias_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "score_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "score_categorias_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "score_categorias_id_seq";

-- AlterTable
ALTER TABLE "public"."score_features" DROP CONSTRAINT "score_features_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "score_categoria_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "score_features_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "score_features_id_seq";

-- AlterTable
ALTER TABLE "public"."score_recomendacoes" DROP CONSTRAINT "score_recomendacoes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "score_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "score_recomendacoes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "score_recomendacoes_id_seq";

-- AlterTable
ALTER TABLE "public"."scores" DROP CONSTRAINT "scores_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "scores_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "scores_id_seq";

-- AlterTable
ALTER TABLE "public"."tomadores" DROP CONSTRAINT "tomadores_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tomadores_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tomadores_id_seq";

-- AlterTable
ALTER TABLE "public"."top_clientes" DROP CONSTRAINT "top_clientes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "top_clientes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "top_clientes_id_seq";

-- CreateTable
CREATE TABLE "public"."user" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "_id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "_id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."carteiras" (
    "id" TEXT NOT NULL,
    "uid_usuario" TEXT NOT NULL,
    "saldo_atual" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "disponivel_saque" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_bloqueado" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carteiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transacoes_carteira" (
    "id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "uid_usuario" TEXT NOT NULL,
    "tipo" "public"."WalletTransactionType" NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "public"."WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "referencia" TEXT,
    "metadata" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processado_em" TIMESTAMP(3),

    CONSTRAINT "transacoes_carteira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "carteiras_uid_usuario_key" ON "public"."carteiras"("uid_usuario");

-- CreateIndex
CREATE INDEX "carteiras_uid_usuario_idx" ON "public"."carteiras"("uid_usuario");

-- CreateIndex
CREATE INDEX "transacoes_carteira_uid_usuario_idx" ON "public"."transacoes_carteira"("uid_usuario");

-- CreateIndex
CREATE INDEX "transacoes_carteira_carteira_id_idx" ON "public"."transacoes_carteira"("carteira_id");

-- CreateIndex
CREATE INDEX "transacoes_carteira_status_idx" ON "public"."transacoes_carteira"("status");

-- CreateIndex
CREATE INDEX "transacoes_carteira_tipo_idx" ON "public"."transacoes_carteira"("tipo");

-- AddForeignKey
ALTER TABLE "public"."empresas" ADD CONSTRAINT "empresas_tomador_id_fkey" FOREIGN KEY ("tomador_id") REFERENCES "public"."tomadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."historico_financeiro" ADD CONSTRAINT "historico_financeiro_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metricas_tempo_real" ADD CONSTRAINT "metricas_tempo_real_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metricas_mensais" ADD CONSTRAINT "metricas_mensais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evolucao_metricas" ADD CONSTRAINT "evolucao_metricas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mrr_por_plano" ADD CONSTRAINT "mrr_por_plano_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."top_clientes" ADD CONSTRAINT "top_clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cohorts" ADD CONSTRAINT "cohorts_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scores" ADD CONSTRAINT "scores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."score_categorias" ADD CONSTRAINT "score_categorias_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "public"."scores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."score_features" ADD CONSTRAINT "score_features_score_categoria_id_fkey" FOREIGN KEY ("score_categoria_id") REFERENCES "public"."score_categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."score_recomendacoes" ADD CONSTRAINT "score_recomendacoes_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "public"."scores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insights" ADD CONSTRAINT "insights_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."propostas" ADD CONSTRAINT "propostas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "public"."propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_investidor_id_fkey" FOREIGN KEY ("investidor_id") REFERENCES "public"."investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "public"."propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagamentos" ADD CONSTRAINT "pagamentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_investidor_id_fkey" FOREIGN KEY ("investidor_id") REFERENCES "public"."investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_investimento_id_fkey" FOREIGN KEY ("investimento_id") REFERENCES "public"."investimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_pagamento_id_fkey" FOREIGN KEY ("pagamento_id") REFERENCES "public"."pagamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projecoes_pagamento" ADD CONSTRAINT "projecoes_pagamento_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes_carteira" ADD CONSTRAINT "transacoes_carteira_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "public"."carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
