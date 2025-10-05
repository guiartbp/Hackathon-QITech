# Integração Wizard de Solicitação de Crédito com Banco de Dados

## Resumo da Implementação

Esta implementação conecta o wizard multi-step (step-1 a step-4) de solicitação de crédito ao banco de dados PostgreSQL via Prisma, **sem modificar o schema do banco**.

## Arquivos Criados/Modificados

### 1. Schemas de Validação (`/src/app/(backend)/schemas/propostas/index.ts`)

- ✅ Adicionado `PropostaWizardSchema` para validar dados vindos do wizard
- Aceita campos: `proposito`, `detalhamento`, `connections`, `simulation`
- Mantém compatibilidade com `PropostaSchema` original

### 2. Endpoints de API Criados

#### `/api/tomadores/me/perfil-completo` (GET)

- **Função**: Retorna dados do tomador para inicializar o Step 1
- **Retorna**:
  ```json
  {
    "limite_maximo": 500000,
    "score": 750,
    "mrr_atual": 85000,
    "crescimento_mrr_mensal": 2.1,
    "percentual_mrr_ofertado": 4.2,
    "multiplo_cap": 1.28,
    "tier": "GROWTH",
    "empresa_id": "uuid",
    "empresa_nome": "Nome da Empresa"
  }
  ```
- **Lógica**:
  - Busca Tomador + Empresa + Métricas + Score
  - Calcula limite máximo baseado no MRR (6x MRR anual)
  - Define percentual MRR e múltiplo cap baseado no score

#### `/api/simulacao` (POST)

- **Função**: Gera simulação de pagamento RBF
- **Request**:
  ```json
  {
    "valor_solicitado": 100000
  }
  ```
- **Retorna**:
  ```json
  {
    "valor_solicitado": 100000,
    "multiplo_cap": 1.28,
    "percentual_mrr": 4.2,
    "mrr_atual": 85000,
    "valor_total_retorno": 128000,
    "custo_total": 28000,
    "primeira_parcela": "2025-11-01",
    "projecoes": [
      {
        "cenario": "conservador",
        "crescimento_mrr_mensal": 0.5,
        "prazo_estimado_meses": 36,
        "cronograma": [...]
      },
      // ... base e otimista
    ]
  }
  ```
- **Lógica**:
  - Calcula 3 cenários (conservador, base, otimista)
  - Simula crescimento do MRR
  - Projeta parcelas mensais baseadas em % do MRR

#### `/api/propostas/wizard` (POST)

- **Função**: Cria proposta no banco com dados do wizard
- **Request**:
  ```json
  {
    "empresaId": "",
    "valorSolicitado": 100000,
    "proposito": "Expansão de Marketing",
    "detalhamento": "Investimento em Google Ads...",
    "connections": ["Stripe", "Banco Inter"],
    "simulation": {...},
    "multiploCap": 1.28,
    "percentualMrr": 4.2,
    "duracaoMeses": 24
  }
  ```
- **Retorna**:
  ```json
  {
    "success": true,
    "proposta_id": "uuid",
    "status": "EM_ANALISE",
    "message": "Proposta criada com sucesso!"
  }
  ```
- **Armazenamento sem modificar schema**:
  - `planoUsoFundos`: JSON stringificado com `proposito`, `detalhamento`, `connections`
  - Campos nativos: `valorSolicitado`, `multiploCap`, `percentualMrr`, `duracaoMeses`
  - `statusFunding`: "EM_ANALISE"
  - `dataAbertura`: timestamp atual
  - `scoreNaAbertura`: score do tomador

### 3. Páginas do Wizard Atualizadas

#### Step 1 (`/to/solicitar-credito/step-1/page.tsx`)

- ✅ Substituído mock por chamada real para `/api/tomadores/me/perfil-completo`
- Carrega dados reais: limite máximo, score, MRR, etc.
- Salva no `localStorage`: `valorSolicitado`, `proposito`, `detalhamento`

#### Step 2 (`/to/solicitar-credito/step-2/page.tsx`)

- Sem alterações (ainda usa mock para conexões de API)
- Salva no `localStorage`: `connections` (array de APIs conectadas)

#### Step 3 (`/to/solicitar-credito/step-3/page.tsx`)

- ✅ Substituído mock por chamada real para `/api/simulacao`
- Gera simulação real baseada em dados do banco
- Salva no `localStorage`: `simulation` (objeto completo)

#### Step 4 (`/to/solicitar-credito/step-4/page.tsx`)

- ✅ Substituído mock por chamada real para `/api/propostas/wizard`
- Envia todos os dados coletados para o banco
- Limpa `localStorage` após sucesso
- Navega para página de sucesso

## Fluxo de Dados Completo

```
Step 1: Valor e Propósito
├─ GET /api/tomadores/me/perfil-completo
│  └─ Retorna: limite, score, MRR, taxas
├─ User input: valorSolicitado, proposito, detalhamento
└─ localStorage.setItem('wizardData', {...})

Step 2: Conexões de API
├─ User conecta APIs (Stripe, PayPal, etc)
└─ localStorage: wizardData.connections = ['Stripe', ...]

Step 3: Simulação
├─ POST /api/simulacao { valor_solicitado }
│  └─ Retorna: projeções de pagamento (3 cenários)
└─ localStorage: wizardData.simulation = {...}

Step 4: Confirmação e Envio
├─ POST /api/propostas/wizard { ...wizardData }
│  ├─ Valida dados com PropostaWizardSchema
│  ├─ Busca empresa do usuário autenticado
│  ├─ Cria proposta no banco
│  └─ Retorna: { success, proposta_id, status }
├─ localStorage.removeItem('wizardData')
└─ Router → /to/solicitar-credito/sucesso
```

## Estrutura no Banco (sem modificações)

**Tabela: `propostas`**

```sql
-- Campos utilizados:
- id (UUID)
- empresa_id (FK → empresas)
- valor_solicitado (DECIMAL)
- multiplo_cap (DECIMAL)
- percentual_mrr (DECIMAL)
- duracao_meses (INT)
- plano_uso_fundos (STRING) ← JSON: {proposito, detalhamento, connections}
- status_funding (STRING) ← "EM_ANALISE"
- score_na_abertura (INT)
- data_abertura (DATETIME)
- criado_em, atualizado_em
```

## Cálculos Automáticos

### Limite Máximo

```typescript
limite_maximo = mrr_atual * 12 * 0.5; // 50% do ARR
```

### Percentual MRR (baseado no score)

```typescript
if (score >= 800) → 3.5%
if (score >= 700) → 4.2%
if (score >= 600) → 5.0%
else → 6.0%
```

### Múltiplo Cap (baseado no score)

```typescript
if (score >= 800) → 1.20x
if (score >= 700) → 1.28x
if (score >= 600) → 1.35x
else → 1.45x
```

### Projeção de Pagamento

```typescript
valor_total_retorno = valor_solicitado * multiplo_cap;
parcela_mensal = mrr_projetado * (percentual_mrr / 100);
mrr_projetado = mrr_anterior * (1 + crescimento_mensal / 100);
```

## Segurança

- ✅ Autenticação via `better-auth` (session-based)
- ✅ Validação com Zod schemas
- ✅ Empresa vinculada automaticamente ao usuário logado
- ✅ Dados sensíveis armazenados apenas no banco (não em localStorage após submit)

## Próximos Passos (Sugestões)

1. **Step 2**: Implementar integração real com APIs (Stripe OAuth, etc)
2. **Validação**: Adicionar validação de documentos e compliance
3. **Página de Sucesso**: Criar `/to/solicitar-credito/sucesso` com detalhes da proposta
4. **Dashboard**: Página para acompanhar status da proposta
5. **Notificações**: Email/SMS quando status mudar
6. **Admin**: Painel para aprovar/rejeitar propostas

## Testando

```bash
# 1. Fazer login como Tomador
# 2. Navegar para /to/solicitar-credito/step-1
# 3. Preencher formulário e avançar por todos os steps
# 4. No Step 4, clicar em "Enviar Proposta"
# 5. Verificar no banco:

SELECT p.*, e.razao_social, p.plano_uso_fundos
FROM propostas p
JOIN empresas e ON p.empresa_id = e.id
ORDER BY p.criado_em DESC
LIMIT 1;

# O campo plano_uso_fundos conterá JSON:
# {"proposito": "...", "detalhamento": "...", "connections": [...]}
```

## Observações Importantes

- ❗ **Sem alteração de schema**: Usa campos existentes de forma criativa
- ❗ **Compatibilidade**: Não quebra funcionalidades existentes
- ❗ **Produção**: Testar fluxo completo antes de deploy
- ❗ **Step 2**: Ainda usa mock - implementar OAuth real se necessário
