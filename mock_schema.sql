-- =====================================================
-- SCHEMA WILLLENDING v2.0
-- Sistema de Venture Debt P2P para SaaS
-- =====================================================

-- =====================================================
-- 1. MÓDULO DE USUÁRIOS E IDENTIFICAÇÃO
-- =====================================================

-- Investidores (Lado da Oferta)
CREATE TABLE investidores (
  id SERIAL PRIMARY KEY,
  uid_usuario VARCHAR(255) UNIQUE NOT NULL,
  tipo_pessoa VARCHAR(10) NOT NULL CHECK (tipo_pessoa IN ('PF', 'PJ')),
  
  -- KYC
  documento_identificacao VARCHAR(20) UNIQUE NOT NULL,
  nome_razao_social VARCHAR(255) NOT NULL,
  data_onboarding TIMESTAMP DEFAULT NOW(),
  
  -- Perfil de Risco
  patrimonio_liquido DECIMAL(15,2),
  declaracao_risco BOOLEAN NOT NULL DEFAULT false,
  experiencia_ativos_risco BOOLEAN DEFAULT false,
  modelo_investimento VARCHAR(20) NOT NULL CHECK (modelo_investimento IN ('conservador', 'moderado', 'agressivo')),
  
  -- Operacional
  fonte_recursos VARCHAR(255),
  
  -- Status
  status_kyc VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status_kyc IN ('PENDENTE', 'APROVADO', 'REPROVADO', 'EM_ANALISE')),
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tomadores (Lado da Demanda - Founders/CFOs)
CREATE TABLE tomadores (
  id SERIAL PRIMARY KEY,
  uid_usuario VARCHAR(255) UNIQUE NOT NULL,
  
  -- Identificação Pessoal do Founder
  nome_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  
  -- Status
  status_compliance VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status_compliance IN ('PENDENTE', 'APROVADO', 'REPROVADO', 'EM_REVISAO')),
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Dados Bancários (Unificado)
CREATE TABLE dados_bancarios (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('investidor', 'tomador')),
  
  banco VARCHAR(100),
  agencia VARCHAR(10),
  conta VARCHAR(20),
  tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca', 'pagamento')),
  ispb VARCHAR(8),
  
  is_principal BOOLEAN DEFAULT false,
  ultima_validacao TIMESTAMP,
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dados_bancarios_usuario ON dados_bancarios(usuario_id, tipo_usuario);

-- =====================================================
-- 2. MÓDULO DE EMPRESAS E NEGÓCIOS (SaaS)
-- =====================================================

-- Empresa/SaaS (Separado do Tomador)
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  tomador_id INTEGER NOT NULL REFERENCES tomadores(id) ON DELETE CASCADE,
  
  -- Identificação Legal
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  website VARCHAR(255),
  
  -- Classificação
  segmento VARCHAR(100),
  setor VARCHAR(100), -- Ex: "IA Generativa para escritórios de advocacia"
  estagio_investimento VARCHAR(50) CHECK (estagio_investimento IN ('pre-seed', 'seed', 'serie-a', 'serie-b', 'serie-c+')),
  
  -- Descritivos
  descricao_curta TEXT, -- Para cards do marketplace
  descricao_completa TEXT, -- Para página de detalhes
  produto TEXT, -- README/Pitch
  
  -- Dados Operacionais
  data_fundacao DATE,
  numero_funcionarios INTEGER,
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tomador_id) -- Um tomador tem uma empresa
);

CREATE INDEX idx_empresas_tomador ON empresas(tomador_id);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);

-- =====================================================
-- 3. MÓDULO DE MÉTRICAS E SAÚDE FINANCEIRA
-- =====================================================

-- Histórico Financeiro (Relatórios Estáticos - Mantido)
CREATE TABLE historico_financeiro (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  periodo DATE NOT NULL,
  tipo_relatorio VARCHAR(20) CHECK (tipo_relatorio IN ('mensal', 'trimestral', 'anual')),
  
  -- Balanço Patrimonial
  ativo_total DECIMAL(15,2),
  passivo_total DECIMAL(15,2),
  patrimonio_liquido DECIMAL(15,2),
  
  -- DRE
  receita_liquida DECIMAL(15,2),
  custo_aquisicao_cliente DECIMAL(15,2),
  
  -- Dívidas
  obrigacoes_divida TEXT,
  valor_total_dividas DECIMAL(15,2),
  
  -- Metadados
  fonte_dados VARCHAR(50),
  verificado_por VARCHAR(255),
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_historico_financeiro_empresa ON historico_financeiro(empresa_id, periodo DESC);

-- Métricas em Tempo Real (Streaming - Mantido)
CREATE TABLE metricas_tempo_real (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  timestamp_captura TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Billing
  mrr DECIMAL(15,2),
  arr DECIMAL(15,2),
  nrr DECIMAL(8,2), -- Net Revenue Retention %
  
  -- Engagement/Health
  usuarios_ativos INTEGER,
  churn_rate DECIMAL(8,4),
  
  -- Custos
  opex_mensal DECIMAL(15,2),
  
  -- Indicadores Calculados
  ltv_cac_ajustado DECIMAL(8,2),
  dscr_ajustado DECIMAL(8,2),
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metricas_tempo_real_empresa ON metricas_tempo_real(empresa_id, timestamp_captura DESC);

-- Métricas Mensais Agregadas (Aprimorado)
CREATE TABLE metricas_mensais (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL, -- Primeiro dia do mês
  
  -- 1. Receita
  mrr_final DECIMAL(15,2),
  mrr_medio DECIMAL(15,2),
  arr_final DECIMAL(15,2),
  nrr_mensal DECIMAL(8,2),
  
  -- 2. Clientes
  num_clientes_inicio INTEGER,
  num_clientes_final INTEGER,
  novos_clientes INTEGER,
  clientes_cancelados INTEGER,
  
  -- 3. Custos e Eficiência
  investimento_marketing_vendas DECIMAL(15,2),
  cac_pago DECIMAL(15,2),
  ltv_medio DECIMAL(15,2),
  ltv_cac_ratio DECIMAL(8,2),
  ticket_medio DECIMAL(15,2), -- ARPU
  
  -- 4. Cash Flow
  receita_total DECIMAL(15,2),
  opex_mensal DECIMAL(15,2),
  net_burn_mensal DECIMAL(15,2),
  cash_balance_final DECIMAL(15,2),
  cash_runway_meses INTEGER,
  
  -- 5. Qualidade da Receita
  expansion_mrr DECIMAL(15,2),
  contraction_mrr DECIMAL(15,2),
  expansion_pct DECIMAL(8,2),
  contraction_pct DECIMAL(8,2),
  
  -- 6. Preditivos
  churn_rate_medio DECIMAL(8,4),
  dscr_ajustado_mensal DECIMAL(8,2),
  margem_bruta DECIMAL(8,2),
  burn_multiple DECIMAL(8,2),
  cac_payback_meses INTEGER,
  magic_number DECIMAL(8,2),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(empresa_id, mes_referencia)
);

CREATE INDEX idx_metricas_mensais_empresa ON metricas_mensais(empresa_id, mes_referencia DESC);

-- Nova: Evolução Temporal Detalhada (Para Gráficos)
CREATE TABLE evolucao_metricas (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  data_referencia DATE NOT NULL, -- Pode ser diário, semanal, mensal
  tipo_periodo VARCHAR(20) CHECK (tipo_periodo IN ('diario', 'semanal', 'mensal', 'anual')),
  
  -- Métricas para Gráficos
  arr DECIMAL(15,2),
  mrr DECIMAL(15,2),
  num_clientes INTEGER,
  
  criado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(empresa_id, data_referencia, tipo_periodo)
);

CREATE INDEX idx_evolucao_metricas_empresa ON evolucao_metricas(empresa_id, data_referencia DESC);

-- Nova: Distribuição de MRR por Planos
CREATE TABLE mrr_por_plano (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  
  nome_plano VARCHAR(100) NOT NULL,
  mrr_plano DECIMAL(15,2) NOT NULL,
  num_clientes_plano INTEGER,
  percentual_total DECIMAL(8,2),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(empresa_id, mes_referencia, nome_plano)
);

CREATE INDEX idx_mrr_plano_empresa ON mrr_por_plano(empresa_id, mes_referencia DESC);

-- Nova: Top Clientes (Para Análise de Concentração)
CREATE TABLE top_clientes (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_emoji VARCHAR(10),
  plano VARCHAR(100),
  mrr_cliente DECIMAL(15,2) NOT NULL,
  percentual_mrr_total DECIMAL(8,2),
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_top_clientes_empresa ON top_clientes(empresa_id, mes_referencia DESC);

-- Nova: Análise de Cohorts
CREATE TABLE cohorts (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cohort_mes DATE NOT NULL, -- Mês de aquisição do cohort
  
  clientes_iniciais INTEGER NOT NULL,
  retencao_m0 DECIMAL(8,2) DEFAULT 100.00, -- Sempre 100%
  retencao_m1 DECIMAL(8,2),
  retencao_m2 DECIMAL(8,2),
  retencao_m3 DECIMAL(8,2),
  retencao_m6 DECIMAL(8,2),
  retencao_m12 DECIMAL(8,2),
  ltv_medio DECIMAL(15,2),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(empresa_id, cohort_mes)
);

CREATE INDEX idx_cohorts_empresa ON cohorts(empresa_id, cohort_mes DESC);

-- =====================================================
-- 4. MÓDULO DE SCORE DE CRÉDITO (Aprimorado)
-- =====================================================

-- Score Principal
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  
  score_total INTEGER NOT NULL CHECK (score_total >= 0 AND score_total <= 100),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('Excelente', 'Bom', 'Regular', 'Baixo')),
  variacao_mensal INTEGER, -- Pontos que variou vs mês anterior
  ranking_percentil INTEGER, -- Top X%
  
  tipo_score VARCHAR(20) NOT NULL CHECK (tipo_score IN ('inicial', 'operacional', 'recalculo')),
  metodo VARCHAR(50), -- 'manual', 'regra', 'ml_model_v1'
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scores_empresa ON scores(empresa_id, criado_em DESC);

-- Score por Categoria
CREATE TABLE score_categorias (
  id SERIAL PRIMARY KEY,
  score_id INTEGER NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
  
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('receita_crescimento', 'eficiencia_roi', 'saude_sustentabilidade', 'qualidade_receita')),
  score_categoria INTEGER NOT NULL CHECK (score_categoria >= 0 AND score_categoria <= 100),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(score_id, categoria)
);

-- Features do Score (Breakdown Detalhado)
CREATE TABLE score_features (
  id SERIAL PRIMARY KEY,
  score_categoria_id INTEGER NOT NULL REFERENCES score_categorias(id) ON DELETE CASCADE,
  
  feature_nome VARCHAR(50) NOT NULL, -- 'mrr', 'arr', 'churn_projetado', etc.
  feature_valor DECIMAL(15,4),
  feature_peso INTEGER CHECK (feature_peso >= 1 AND feature_peso <= 5), -- 1-5
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_score_features_categoria ON score_features(score_categoria_id);

-- Recomendações do Score
CREATE TABLE score_recomendacoes (
  id SERIAL PRIMARY KEY,
  score_id INTEGER NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
  
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  impacto_estimado INTEGER, -- Pontos de impacto
  prioridade INTEGER CHECK (prioridade >= 1 AND prioridade <= 5),
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_score_recomendacoes_score ON score_recomendacoes(score_id);

-- =====================================================
-- 5. MÓDULO DE INSIGHTS E ALERTAS
-- =====================================================

CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('info', 'alerta', 'critico', 'oportunidade')),
  categoria VARCHAR(50), -- 'receita', 'churn', 'cac', 'ltv', etc.
  
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  
  is_lido BOOLEAN DEFAULT false,
  is_arquivado BOOLEAN DEFAULT false,
  
  data_expiracao TIMESTAMP, -- Insights podem expirar
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_empresa ON insights(empresa_id, criado_em DESC);
CREATE INDEX idx_insights_tipo ON insights(empresa_id, tipo, is_lido);

-- =====================================================
-- 6. MÓDULO DE PROPOSTAS E CONTRATOS
-- =====================================================

-- Propostas (Antes de virar Contrato)
CREATE TABLE propostas (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  
  -- Termos Solicitados
  valor_solicitado DECIMAL(15,2) NOT NULL,
  multiplo_cap DECIMAL(4,2) NOT NULL, -- Ex: 1.30
  percentual_mrr DECIMAL(8,2) NOT NULL, -- % do MRR para repagamento
  duracao_meses INTEGER NOT NULL,
  valor_minimo_funding DECIMAL(15,2), -- Mínimo para ativar
  
  -- Plano de Uso
  plano_uso_fundos TEXT,
  
  -- Status de Funding
  status_funding VARCHAR(20) NOT NULL DEFAULT 'RASCUNHO' CHECK (
    status_funding IN ('RASCUNHO', 'EM_ANALISE', 'ABERTO', 'FUNDING', 'FINANCIADO', 'CANCELADO', 'REJEITADO')
  ),
  
  valor_financiado DECIMAL(15,2) DEFAULT 0,
  progresso_funding DECIMAL(8,2) DEFAULT 0, -- %
  
  -- Datas
  data_abertura TIMESTAMP,
  data_fechamento TIMESTAMP,
  dias_aberta INTEGER, -- Calculado
  
  -- Score no momento da proposta
  score_na_abertura INTEGER,
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_propostas_empresa ON propostas(empresa_id);
CREATE INDEX idx_propostas_status ON propostas(status_funding);

-- Contratos (Propostas Ativadas)
CREATE TABLE contratos (
  id SERIAL PRIMARY KEY,
  proposta_id INTEGER NOT NULL REFERENCES propostas(id) ON DELETE CASCADE,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  
  -- Termos do Contrato (copiados da proposta)
  valor_principal DECIMAL(15,2) NOT NULL,
  multiplo_cap DECIMAL(4,2) NOT NULL,
  percentual_mrr DECIMAL(8,2) NOT NULL,
  valor_total_devido DECIMAL(15,2) NOT NULL, -- valor_principal * multiplo_cap
  
  -- Datas
  data_inicio DATE NOT NULL,
  data_fim_prevista DATE,
  data_fim_real DATE,
  
  -- Status
  status_contrato VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (
    status_contrato IN ('ATIVO', 'QUITADO', 'INADIMPLENTE', 'RENEGOCIADO', 'CANCELADO')
  ),
  
  -- Monitoramento
  valor_total_pago DECIMAL(15,2) DEFAULT 0,
  percentual_pago DECIMAL(8,2) DEFAULT 0,
  multiplo_atingido DECIMAL(4,2) DEFAULT 0,
  ultima_metrica_mensal_id INTEGER REFERENCES metricas_mensais(id),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(proposta_id)
);

CREATE INDEX idx_contratos_empresa ON contratos(empresa_id);
CREATE INDEX idx_contratos_status ON contratos(status_contrato);
CREATE INDEX idx_contratos_proposta ON contratos(proposta_id);

-- Investimentos (N:M entre Investidores e Propostas/Contratos)
CREATE TABLE investimentos (
  id SERIAL PRIMARY KEY,
  proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
  contrato_id INTEGER REFERENCES contratos(id) ON DELETE CASCADE,
  investidor_id INTEGER NOT NULL REFERENCES investidores(id) ON DELETE CASCADE,
  
  valor_aportado DECIMAL(15,2) NOT NULL,
  percentual_participacao DECIMAL(8,4), -- % do total
  
  -- Status
  status_investimento VARCHAR(20) DEFAULT 'PENDENTE' CHECK (
    status_investimento IN ('PENDENTE', 'CONFIRMADO', 'CANCELADO')
  ),
  
  -- Retorno
  valor_total_recebido DECIMAL(15,2) DEFAULT 0,
  tir_realizado DECIMAL(8,2), -- TIR quando finalizado
  
  data_investimento TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_proposta_ou_contrato CHECK (
    (proposta_id IS NOT NULL AND contrato_id IS NULL) OR
    (proposta_id IS NULL AND contrato_id IS NOT NULL)
  )
);

CREATE INDEX idx_investimentos_investidor ON investimentos(investidor_id);
CREATE INDEX idx_investimentos_proposta ON investimentos(proposta_id);
CREATE INDEX idx_investimentos_contrato ON investimentos(contrato_id);

-- =====================================================
-- 7. MÓDULO DE PAGAMENTOS
-- =====================================================

-- Pagamentos/Repagamentos
CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  contrato_id INTEGER NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  
  -- Tipo
  tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('MENSAL', 'EXTRA', 'QUITACAO')),
  
  -- Datas
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  dias_atraso INTEGER DEFAULT 0,
  
  -- Valores
  mrr_periodo DECIMAL(15,2), -- MRR base para cálculo
  valor_esperado DECIMAL(15,2) NOT NULL,
  valor_pago DECIMAL(15,2),
  
  -- Acumulados
  valor_acumulado_pago DECIMAL(15,2),
  multiplo_atingido DECIMAL(4,2),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'AGENDADO' CHECK (
    status IN ('AGENDADO', 'PROJETADO', 'PENDENTE', 'PAGO', 'PAGO_PARCIAL', 'ATRASADO', 'CANCELADO')
  ),
  
  -- Metadados
  taxa_efetiva DECIMAL(8,2),
  metodo_pagamento VARCHAR(50),
  
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pagamentos_contrato ON pagamentos(contrato_id, data_vencimento);
CREATE INDEX idx_pagamentos_status ON pagamentos(status, data_vencimento);

-- Repasses aos Investidores
CREATE TABLE repasses (
  id SERIAL PRIMARY KEY,
  pagamento_id INTEGER NOT NULL REFERENCES pagamentos(id) ON DELETE CASCADE,
  investimento_id INTEGER NOT NULL REFERENCES investimentos(id) ON DELETE CASCADE,
  investidor_id INTEGER NOT NULL REFERENCES investidores(id) ON DELETE CASCADE,
  
  valor_repasse DECIMAL(15,2) NOT NULL,
  principal_devolvido DECIMAL(15,2),
  retorno_bruto DECIMAL(15,2),
  
  status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (
    status IN ('PENDENTE', 'PROCESSANDO', 'EXECUTADO', 'FALHA')
  ),
  
  data_execucao TIMESTAMP,
  
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_repasses_pagamento ON repasses(pagamento_id);
CREATE INDEX idx_repasses_investidor ON repasses(investidor_id, data_execucao DESC);

-- Nova: Projeções de Pagamentos Futuros
CREATE TABLE projecoes_pagamento (
  id SERIAL PRIMARY KEY,
  contrato_id INTEGER NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  
  mes_referencia DATE NOT NULL,
  valor_projetado DECIMAL(15,2) NOT NULL,
  mrr_projetado DECIMAL(15,2),
  
  confianca DECIMAL(8,2), -- % de confiança na projeção
  metodo_projecao VARCHAR(50), -- 'historico', 'tendencia', 'ml'
  
  criado_em TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(contrato_id, mes_referencia)
);

CREATE INDEX idx_projecoes_contrato ON projecoes_pagamento(contrato_id, mes_referencia);

-- =====================================================
-- 8. AUDITORIA E LOGS
-- =====================================================

CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  entidade VARCHAR(50) NOT NULL,
  entidade_id INTEGER NOT NULL,
  acao VARCHAR(20) NOT NULL CHECK (acao IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT')),
  usuario_id VARCHAR(255) NOT NULL,
  
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address INET,
  user_agent TEXT,
  
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_entidade ON audit_log(entidade, entidade_id);
CREATE INDEX idx_audit_log_usuario ON audit_log(usuario_id, timestamp DESC);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);

-- =====================================================
-- 9. VIEWS ÚTEIS
-- =====================================================

-- View: Dashboard Investidor
CREATE VIEW vw_dashboard_investidor AS
SELECT 
  i.id as investidor_id,
  i.nome_razao_social,
  COUNT(DISTINCT inv.contrato_id) as contratos_ativos,
  COUNT(DISTINCT CASE WHEN c.status_contrato = 'QUITADO' THEN inv.contrato_id END) as contratos_finalizados,
  COALESCE(SUM(inv.valor_aportado), 0) as capital_investido,
  COALESCE(SUM(inv.valor_total_recebido), 0) as total_recebido,
  COALESCE(AVG(inv.tir_realizado), 0) as tir_media
FROM investidores i
LEFT JOIN investimentos inv ON i.id = inv.investidor_id
LEFT JOIN contratos c ON inv.contrato_id = c.id
GROUP BY i.id, i.nome_razao_social;

-- View: Próximos Pagamentos (para Tomador e Investidor)
CREATE VIEW vw_proximos_pagamentos AS
SELECT 
  p.id as pagamento_id,
  p.contrato_id,
  c.empresa_id,
  e.razao_social,
  e.nome_fantasia,
  p.data_vencimento,
  p.valor_esperado,
  p.status,
  (p.data_vencimento - CURRENT_DATE) as dias_restantes,
  p.mrr_periodo,
  p.taxa_efetiva
FROM pagamentos p
JOIN contratos c ON p.contrato_id = c.id
JOIN empresas e ON c.empresa_id = e.id
WHERE p.status IN ('AGENDADO', 'PENDENTE')
  AND p.data_vencimento >= CURRENT_DATE
ORDER BY p.data_vencimento ASC;

-- View: Portfolio do Investidor
CREATE VIEW vw_portfolio_investidor AS
SELECT 
  i.id as investidor_id,
  i.nome_razao_social as investidor_nome,
  c.id as contrato_id,
  e.razao_social as empresa_nome,
  inv.valor_aportado,
  inv.valor_total_recebido,
  c.valor_principal,
  c.multiplo_cap,
  c.percentual_pago,
  c.status_contrato,
  (SELECT data_vencimento FROM pagamentos WHERE contrato_id = c.id AND status IN ('AGENDADO', 'PENDENTE') ORDER BY data_vencimento ASC LIMIT 1) as proximo_pagamento_data,
  (SELECT valor_esperado FROM pagamentos WHERE contrato_id = c.id AND status IN ('AGENDADO', 'PENDENTE') ORDER BY data_vencimento ASC LIMIT 1) as proximo_pagamento_valor
FROM investidores i
JOIN investimentos inv ON i.id = inv.investidor_id
JOIN contratos c ON inv.contrato_id = c.id
JOIN empresas e ON c.empresa_id = e.id;

-- View: Métricas Atuais da Empresa
CREATE VIEW vw_metricas_atuais_empresa AS
SELECT 
  e.id as empresa_id,
  e.razao_social,
  e.nome_fantasia,
  e.emoji,
  mm.mrr_final as mrr_atual,
  mm.arr_final as arr_atual,
  mm.num_clientes_final as num_clientes,
  mm.churn_rate_medio as churn_rate,
  mm.ltv_cac_ratio,
  mm.cash_runway_meses as runway,
  mm.ticket_medio,
  mm.cac_pago as cac,
  mm.ltv_medio as ltv,
  s.score_total as score,
  s.tier as score_tier
FROM empresas e
LEFT JOIN LATERAL (
  SELECT * FROM metricas_mensais 
  WHERE empresa_id = e.id 
  ORDER BY mes_referencia DESC 
  LIMIT 1
) mm ON true
LEFT JOIN LATERAL (
  SELECT * FROM scores 
  WHERE empresa_id = e.id 
  ORDER BY criado_em DESC 
  LIMIT 1
) s ON true;

-- =====================================================
-- 10. FUNCTIONS E TRIGGERS
-- =====================================================

-- Function: Atualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_investidores_updated_at BEFORE UPDATE ON investidores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tomadores_updated_at BEFORE UPDATE ON tomadores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at BEFORE UPDATE ON propostas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Calcular percentual de funding
CREATE OR REPLACE FUNCTION calcular_progresso_funding()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.valor_solicitado > 0 THEN
    NEW.progresso_funding = (NEW.valor_financiado / NEW.valor_solicitado) * 100;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_progresso BEFORE INSERT OR UPDATE ON propostas
  FOR EACH ROW EXECUTE FUNCTION calcular_progresso_funding();

-- Function: Atualizar valor_total_pago no contrato
CREATE OR REPLACE FUNCTION atualizar_totais_contrato()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'PAGO' THEN
    UPDATE contratos SET
      valor_total_pago = (
        SELECT COALESCE(SUM(valor_pago), 0)
        FROM pagamentos
        WHERE contrato_id = NEW.contrato_id AND status = 'PAGO'
      ),
      percentual_pago = CASE 
        WHEN valor_total_devido > 0 THEN
          ((SELECT COALESCE(SUM(valor_pago), 0) FROM pagamentos WHERE contrato_id = NEW.contrato_id AND status = 'PAGO') / valor_total_devido) * 100
        ELSE 0
      END,
      multiplo_atingido = CASE
        WHEN valor_principal > 0 THEN
          (SELECT COALESCE(SUM(valor_pago), 0) FROM pagamentos WHERE contrato_id = NEW.contrato_id AND status = 'PAGO') / valor_principal
        ELSE 0
      END
    WHERE id = NEW.contrato_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_contrato AFTER INSERT OR UPDATE ON pagamentos
  FOR EACH ROW EXECUTE FUNCTION atualizar_totais_contrato();

-- =====================================================
-- 11. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE empresas IS 'Dados das empresas SaaS (separado do tomador pessoa física)';
COMMENT ON TABLE propostas IS 'Propostas de crédito antes de virarem contratos ativos';
COMMENT ON TABLE contratos IS 'Contratos ativos de venture debt';
COMMENT ON TABLE metricas_mensais IS 'Agregação mensal de métricas para monitoramento e covenants';
COMMENT ON TABLE scores IS 'Score de crédito calculado para cada empresa';
COMMENT ON TABLE score_categorias IS 'Breakdown do score por categoria';
COMMENT ON TABLE score_features IS 'Features individuais que compõem cada categoria do score';
COMMENT ON TABLE insights IS 'Insights e alertas gerados pelo sistema para as empresas';
COMMENT ON TABLE pagamentos IS 'Pagamentos mensais de contratos RBF';
COMMENT ON TABLE projecoes_pagamento IS 'Projeções futuras de pagamentos para planejamento';
COMMENT ON TABLE cohorts IS 'Análise de cohorts de clientes para LTV';
COMMENT ON TABLE mrr_por_plano IS 'Distribuição de MRR entre diferentes planos de preço';
