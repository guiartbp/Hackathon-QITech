-- CreateTable
CREATE TABLE "public"."investidores" (
    "id" SERIAL NOT NULL,
    "uid_usuario" TEXT NOT NULL,
    "tipo_pessoa" TEXT NOT NULL,
    "documento_identificacao" TEXT NOT NULL,
    "nome_razao_social" TEXT NOT NULL,
    "data_onboarding" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patrimonio_liquido" DECIMAL(15,2),
    "declaracao_risco" BOOLEAN NOT NULL DEFAULT false,
    "experiencia_ativos_risco" BOOLEAN DEFAULT false,
    "modelo_investimento" TEXT NOT NULL,
    "fonte_recursos" TEXT,
    "status_kyc" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tomadores" (
    "id" SERIAL NOT NULL,
    "uid_usuario" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT,
    "status_compliance" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tomadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dados_bancarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "banco" TEXT,
    "agencia" TEXT,
    "conta" TEXT,
    "tipo_conta" TEXT,
    "ispb" TEXT,
    "is_principal" BOOLEAN NOT NULL DEFAULT false,
    "ultima_validacao" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dados_bancarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."empresas" (
    "id" SERIAL NOT NULL,
    "tomador_id" INTEGER NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "website" TEXT,
    "segmento" TEXT,
    "setor" TEXT,
    "estagio_investimento" TEXT,
    "descricao_curta" TEXT,
    "descricao_completa" TEXT,
    "produto" TEXT,
    "data_fundacao" DATE,
    "numero_funcionarios" INTEGER,
    "emoji" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."historico_financeiro" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "periodo" DATE NOT NULL,
    "tipo_relatorio" TEXT,
    "ativo_total" DECIMAL(15,2),
    "passivo_total" DECIMAL(15,2),
    "patrimonio_liquido" DECIMAL(15,2),
    "receita_liquida" DECIMAL(15,2),
    "custo_aquisicao_cliente" DECIMAL(15,2),
    "obrigacoes_divida" TEXT,
    "valor_total_dividas" DECIMAL(15,2),
    "fonte_dados" TEXT,
    "verificado_por" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metricas_tempo_real" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "timestamp_captura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mrr" DECIMAL(15,2),
    "arr" DECIMAL(15,2),
    "nrr" DECIMAL(8,2),
    "usuarios_ativos" INTEGER,
    "churn_rate" DECIMAL(8,4),
    "opex_mensal" DECIMAL(15,2),
    "ltv_cac_ajustado" DECIMAL(8,2),
    "dscr_ajustado" DECIMAL(8,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metricas_tempo_real_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metricas_mensais" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "mes_referencia" DATE NOT NULL,
    "mrr_final" DECIMAL(15,2),
    "mrr_medio" DECIMAL(15,2),
    "arr_final" DECIMAL(15,2),
    "nrr_mensal" DECIMAL(8,2),
    "num_clientes_inicio" INTEGER,
    "num_clientes_final" INTEGER,
    "novos_clientes" INTEGER,
    "clientes_cancelados" INTEGER,
    "investimento_marketing_vendas" DECIMAL(15,2),
    "cac_pago" DECIMAL(15,2),
    "ltv_medio" DECIMAL(15,2),
    "ltv_cac_ratio" DECIMAL(8,2),
    "ticket_medio" DECIMAL(15,2),
    "receita_total" DECIMAL(15,2),
    "opex_mensal" DECIMAL(15,2),
    "net_burn_mensal" DECIMAL(15,2),
    "cash_balance_final" DECIMAL(15,2),
    "cash_runway_meses" INTEGER,
    "expansion_mrr" DECIMAL(15,2),
    "contraction_mrr" DECIMAL(15,2),
    "expansion_pct" DECIMAL(8,2),
    "contraction_pct" DECIMAL(8,2),
    "churn_rate_medio" DECIMAL(8,4),
    "dscr_ajustado_mensal" DECIMAL(8,2),
    "margem_bruta" DECIMAL(8,2),
    "burn_multiple" DECIMAL(8,2),
    "cac_payback_meses" INTEGER,
    "magic_number" DECIMAL(8,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metricas_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evolucao_metricas" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "data_referencia" DATE NOT NULL,
    "tipo_periodo" TEXT NOT NULL,
    "arr" DECIMAL(15,2),
    "mrr" DECIMAL(15,2),
    "num_clientes" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evolucao_metricas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mrr_por_plano" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "mes_referencia" DATE NOT NULL,
    "nome_plano" TEXT NOT NULL,
    "mrr_plano" DECIMAL(15,2) NOT NULL,
    "num_clientes_plano" INTEGER,
    "percentual_total" DECIMAL(8,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mrr_por_plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."top_clientes" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "mes_referencia" DATE NOT NULL,
    "cliente_nome" TEXT NOT NULL,
    "cliente_emoji" TEXT,
    "plano" TEXT,
    "mrr_cliente" DECIMAL(15,2) NOT NULL,
    "percentual_mrr_total" DECIMAL(8,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cohorts" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "cohort_mes" DATE NOT NULL,
    "clientes_iniciais" INTEGER NOT NULL,
    "retencao_m0" DECIMAL(8,2) NOT NULL DEFAULT 100.00,
    "retencao_m1" DECIMAL(8,2),
    "retencao_m2" DECIMAL(8,2),
    "retencao_m3" DECIMAL(8,2),
    "retencao_m6" DECIMAL(8,2),
    "retencao_m12" DECIMAL(8,2),
    "ltv_medio" DECIMAL(15,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scores" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "score_total" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "variacao_mensal" INTEGER,
    "ranking_percentil" INTEGER,
    "tipo_score" TEXT NOT NULL,
    "metodo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."score_categorias" (
    "id" SERIAL NOT NULL,
    "score_id" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "score_categoria" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."score_features" (
    "id" SERIAL NOT NULL,
    "score_categoria_id" INTEGER NOT NULL,
    "feature_nome" TEXT NOT NULL,
    "feature_valor" DECIMAL(15,4),
    "feature_peso" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."score_recomendacoes" (
    "id" SERIAL NOT NULL,
    "score_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "impacto_estimado" INTEGER,
    "prioridade" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_recomendacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."insights" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "is_lido" BOOLEAN NOT NULL DEFAULT false,
    "is_arquivado" BOOLEAN NOT NULL DEFAULT false,
    "data_expiracao" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."propostas" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "valor_solicitado" DECIMAL(15,2) NOT NULL,
    "multiplo_cap" DECIMAL(4,2) NOT NULL,
    "percentual_mrr" DECIMAL(8,2) NOT NULL,
    "duracao_meses" INTEGER NOT NULL,
    "valor_minimo_funding" DECIMAL(15,2),
    "plano_uso_fundos" TEXT,
    "status_funding" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "valor_financiado" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "progresso_funding" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "data_abertura" TIMESTAMP(3),
    "data_fechamento" TIMESTAMP(3),
    "dias_aberta" INTEGER,
    "score_na_abertura" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contratos" (
    "id" SERIAL NOT NULL,
    "proposta_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "valor_principal" DECIMAL(15,2) NOT NULL,
    "multiplo_cap" DECIMAL(4,2) NOT NULL,
    "percentual_mrr" DECIMAL(8,2) NOT NULL,
    "valor_total_devido" DECIMAL(15,2) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim_prevista" DATE,
    "data_fim_real" DATE,
    "status_contrato" TEXT NOT NULL DEFAULT 'ATIVO',
    "valor_total_pago" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "percentual_pago" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "multiplo_atingido" DECIMAL(4,2) NOT NULL DEFAULT 0,
    "ultima_metrica_mensal_id" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."investimentos" (
    "id" SERIAL NOT NULL,
    "proposta_id" INTEGER,
    "contrato_id" INTEGER,
    "investidor_id" INTEGER NOT NULL,
    "valor_aportado" DECIMAL(15,2) NOT NULL,
    "percentual_participacao" DECIMAL(8,4),
    "status_investimento" TEXT NOT NULL DEFAULT 'PENDENTE',
    "valor_total_recebido" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tir_realizado" DECIMAL(8,2),
    "data_investimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagamentos" (
    "id" SERIAL NOT NULL,
    "contrato_id" INTEGER NOT NULL,
    "tipo_pagamento" TEXT NOT NULL,
    "data_vencimento" DATE NOT NULL,
    "data_pagamento" DATE,
    "dias_atraso" INTEGER NOT NULL DEFAULT 0,
    "mrr_periodo" DECIMAL(15,2),
    "valor_esperado" DECIMAL(15,2) NOT NULL,
    "valor_pago" DECIMAL(15,2),
    "valor_acumulado_pago" DECIMAL(15,2),
    "multiplo_atingido" DECIMAL(4,2),
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "taxa_efetiva" DECIMAL(8,2),
    "metodo_pagamento" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."repasses" (
    "id" SERIAL NOT NULL,
    "pagamento_id" INTEGER NOT NULL,
    "investimento_id" INTEGER NOT NULL,
    "investidor_id" INTEGER NOT NULL,
    "valor_repasse" DECIMAL(15,2) NOT NULL,
    "principal_devolvido" DECIMAL(15,2),
    "retorno_bruto" DECIMAL(15,2),
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "data_execucao" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projecoes_pagamento" (
    "id" SERIAL NOT NULL,
    "contrato_id" INTEGER NOT NULL,
    "mes_referencia" DATE NOT NULL,
    "valor_projetado" DECIMAL(15,2) NOT NULL,
    "mrr_projetado" DECIMAL(15,2),
    "confianca" DECIMAL(8,2),
    "metodo_projecao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projecoes_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_log" (
    "id" SERIAL NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "dados_anteriores" JSONB,
    "dados_novos" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investidores_uid_usuario_key" ON "public"."investidores"("uid_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "investidores_documento_identificacao_key" ON "public"."investidores"("documento_identificacao");

-- CreateIndex
CREATE UNIQUE INDEX "tomadores_uid_usuario_key" ON "public"."tomadores"("uid_usuario");

-- CreateIndex
CREATE INDEX "dados_bancarios_usuario_id_tipo_usuario_idx" ON "public"."dados_bancarios"("usuario_id", "tipo_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_tomador_id_key" ON "public"."empresas"("tomador_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "public"."empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_tomador_id_idx" ON "public"."empresas"("tomador_id");

-- CreateIndex
CREATE INDEX "empresas_cnpj_idx" ON "public"."empresas"("cnpj");

-- CreateIndex
CREATE INDEX "historico_financeiro_empresa_id_periodo_idx" ON "public"."historico_financeiro"("empresa_id", "periodo" DESC);

-- CreateIndex
CREATE INDEX "metricas_tempo_real_empresa_id_timestamp_captura_idx" ON "public"."metricas_tempo_real"("empresa_id", "timestamp_captura" DESC);

-- CreateIndex
CREATE INDEX "metricas_mensais_empresa_id_mes_referencia_idx" ON "public"."metricas_mensais"("empresa_id", "mes_referencia" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "metricas_mensais_empresa_id_mes_referencia_key" ON "public"."metricas_mensais"("empresa_id", "mes_referencia");

-- CreateIndex
CREATE INDEX "evolucao_metricas_empresa_id_data_referencia_idx" ON "public"."evolucao_metricas"("empresa_id", "data_referencia" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "evolucao_metricas_empresa_id_data_referencia_tipo_periodo_key" ON "public"."evolucao_metricas"("empresa_id", "data_referencia", "tipo_periodo");

-- CreateIndex
CREATE INDEX "mrr_por_plano_empresa_id_mes_referencia_idx" ON "public"."mrr_por_plano"("empresa_id", "mes_referencia" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "mrr_por_plano_empresa_id_mes_referencia_nome_plano_key" ON "public"."mrr_por_plano"("empresa_id", "mes_referencia", "nome_plano");

-- CreateIndex
CREATE INDEX "top_clientes_empresa_id_mes_referencia_idx" ON "public"."top_clientes"("empresa_id", "mes_referencia" DESC);

-- CreateIndex
CREATE INDEX "cohorts_empresa_id_cohort_mes_idx" ON "public"."cohorts"("empresa_id", "cohort_mes" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "cohorts_empresa_id_cohort_mes_key" ON "public"."cohorts"("empresa_id", "cohort_mes");

-- CreateIndex
CREATE INDEX "scores_empresa_id_criado_em_idx" ON "public"."scores"("empresa_id", "criado_em" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "score_categorias_score_id_categoria_key" ON "public"."score_categorias"("score_id", "categoria");

-- CreateIndex
CREATE INDEX "score_features_score_categoria_id_idx" ON "public"."score_features"("score_categoria_id");

-- CreateIndex
CREATE INDEX "score_recomendacoes_score_id_idx" ON "public"."score_recomendacoes"("score_id");

-- CreateIndex
CREATE INDEX "insights_empresa_id_criado_em_idx" ON "public"."insights"("empresa_id", "criado_em" DESC);

-- CreateIndex
CREATE INDEX "insights_empresa_id_tipo_is_lido_idx" ON "public"."insights"("empresa_id", "tipo", "is_lido");

-- CreateIndex
CREATE INDEX "propostas_empresa_id_idx" ON "public"."propostas"("empresa_id");

-- CreateIndex
CREATE INDEX "propostas_status_funding_idx" ON "public"."propostas"("status_funding");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_proposta_id_key" ON "public"."contratos"("proposta_id");

-- CreateIndex
CREATE INDEX "contratos_empresa_id_idx" ON "public"."contratos"("empresa_id");

-- CreateIndex
CREATE INDEX "contratos_status_contrato_idx" ON "public"."contratos"("status_contrato");

-- CreateIndex
CREATE INDEX "contratos_proposta_id_idx" ON "public"."contratos"("proposta_id");

-- CreateIndex
CREATE INDEX "investimentos_investidor_id_idx" ON "public"."investimentos"("investidor_id");

-- CreateIndex
CREATE INDEX "investimentos_proposta_id_idx" ON "public"."investimentos"("proposta_id");

-- CreateIndex
CREATE INDEX "investimentos_contrato_id_idx" ON "public"."investimentos"("contrato_id");

-- CreateIndex
CREATE INDEX "pagamentos_contrato_id_data_vencimento_idx" ON "public"."pagamentos"("contrato_id", "data_vencimento");

-- CreateIndex
CREATE INDEX "pagamentos_status_data_vencimento_idx" ON "public"."pagamentos"("status", "data_vencimento");

-- CreateIndex
CREATE INDEX "repasses_pagamento_id_idx" ON "public"."repasses"("pagamento_id");

-- CreateIndex
CREATE INDEX "repasses_investidor_id_data_execucao_idx" ON "public"."repasses"("investidor_id", "data_execucao" DESC);

-- CreateIndex
CREATE INDEX "projecoes_pagamento_contrato_id_mes_referencia_idx" ON "public"."projecoes_pagamento"("contrato_id", "mes_referencia");

-- CreateIndex
CREATE UNIQUE INDEX "projecoes_pagamento_contrato_id_mes_referencia_key" ON "public"."projecoes_pagamento"("contrato_id", "mes_referencia");

-- CreateIndex
CREATE INDEX "audit_log_entidade_entidade_id_idx" ON "public"."audit_log"("entidade", "entidade_id");

-- CreateIndex
CREATE INDEX "audit_log_usuario_id_timestamp_idx" ON "public"."audit_log"("usuario_id", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "audit_log_timestamp_idx" ON "public"."audit_log"("timestamp" DESC);

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
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "public"."propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "public"."propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_investidor_id_fkey" FOREIGN KEY ("investidor_id") REFERENCES "public"."investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagamentos" ADD CONSTRAINT "pagamentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_pagamento_id_fkey" FOREIGN KEY ("pagamento_id") REFERENCES "public"."pagamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_investimento_id_fkey" FOREIGN KEY ("investimento_id") REFERENCES "public"."investimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repasses" ADD CONSTRAINT "repasses_investidor_id_fkey" FOREIGN KEY ("investidor_id") REFERENCES "public"."investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projecoes_pagamento" ADD CONSTRAINT "projecoes_pagamento_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
