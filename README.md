# ⚙️ Arquivo `.env` — Plataforma P2P Finance

Este arquivo contém as variáveis de ambiente necessárias para executar a plataforma localmente, incluindo:
- Banco de dados Supabase  
- Autenticação com BetterAuth  
- Blockchain (Alchemy + Sepolia)  
- Integração Stripe Connect  

> ⚠️ **Importante:** nunca exponha este arquivo em produção.  
> Todos os valores abaixo são exemplos e devem ser mantidos seguros (use `.env.local` ou variáveis de ambiente do servidor).

---

## 🗄️ Banco de Dados — Supabase

```bash
# Connection Pooling (para conexões do backend)
DATABASE_URL="postgresql://postgres.gwadfwhhreqrqwwfsise:wyHC0MHX0zbvAeB7@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexão direta (usada para migrações Prisma)
DIRECT_URL="postgresql://postgres.gwadfwhhreqrqwwfsise:wyHC0MHX0zbvAeB7@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Chaves públicas para o client-side
NEXT_PUBLIC_SUPABASE_URL="https://gwadfwhhreqrqwwfsise.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YWRmd2hocmVxcnF3d2ZzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTY3NDIsImV4cCI6MjA3NTE5Mjc0Mn0.GEU149kzQgYK2MvwJS-Ayrmd0C_NEbTwHorhqCFUvMg"


## 🧪 Logins de Teste

Para facilitar testes e demonstrações, use as seguintes credenciais:

### 👤 Founder
- **Email:** `founder@qitech.com.br`  
- **Senha:** `qitechhackairado123`

### 💼 Investidor
- **Email:** `investidor@qitech.com.br`  
- **Senha:** `qitechhackairado123`



````markdown
# 💸 Plataforma P2P Finance

Sistema P2P que conecta **founders** e **investidores**, com contratos inteligentes on-chain, integração completa com **Stripe Connect**, e um **motor de score em Machine Learning** para avaliação financeira dinâmica.

---

## 🧭 Visão Geral

A plataforma permite que founders solicitem empréstimos com base em seus dados financeiros reais (via Stripe), enquanto investidores escolhem oportunidades e firmam contratos inteligentes blockchain.  
Todo o fluxo é automatizado, auditável e seguro — combinando Web2 (Stripe + Node) e Web3 (Solidity).

---

## 🧩 Estrutura da Plataforma

### 👤 Área do Founder
- 📄 **Contratos** (on-chain)
- 🧾 **Gerenciamento de negócio**
- 📊 **Meu Score** (Machine Learning)
- 💰 **Meus Pagamentos**
- 💳 **Minhas Dívidas**

### 💼 Área do Investidor
- 📄 **Contratos** (on-chain)
- 🛒 **Marketplace** de oportunidades
- 📈 **Portfólios**
- 💬 **Propostas**
- 💰 **Saldo e detalhes de propostas**

---

## ⚙️ Fluxo de Funcionamento

1. **Cadastro e Login**
   - Founder se cadastra com **BetterAuth**.
   - Conecta sua conta Stripe com permissão `read_only` para leitura de dados financeiros.

2. **Pedido de Empréstimo**
   - A API Stripe coleta dados como faturamento, MRR e churn.
   - O motor de score em Python calcula o risco financeiro do founder.
   - Se o score e as permissões forem válidos, o sistema permite criar um contrato.

3. **Contrato On-Chain**
   - O contrato é criado na blockchain (Solidity).
   - Founder e investidores assinam digitalmente, garantindo prova imutável.

4. **Investimento**
   - Investidores acessam o marketplace e escolhem propostas.
   - Ao investir, o contrato inteligente é atualizado com as participações.

5. **Execução Financeira (Stripe)**
   - Stripe calcula mensalmente o valor do pagamento com base no **MRR (Monthly Recurring Revenue)**.
   - A cobrança é **dinâmica**:
     - Se o founder lucra mais → paga mais.
     - Se o lucro cai → paga menos.

6. **Auditoria e Sincronização**
   - Webhooks Stripe garantem conciliação financeira automática.
   - Dados são armazenados e cruzados com registros on-chain para total transparência.

---

## 🤖 Motor de Score (Machine Learning em Python)

O **motor de score** avalia a saúde financeira de cada founder com base em dados obtidos da API Stripe.  
Ele é integrado ao backend e retorna um **índice de risco dinâmico**, utilizado para definir condições de empréstimo e elegibilidade.

### 🧮 Métricas Utilizadas
| Métrica | Descrição |
|----------|------------|
| **MRR (Monthly Recurring Revenue)** | Receita recorrente mensal |
| **Despesas com Marketing** | Percentual de gastos sobre a receita |
| **Churn** | Taxa de cancelamento de clientes |
| **Novos Clientes** | Crescimento líquido de base ativa |

O modelo é treinado em Python (Scikit-learn), podendo utilizar regressão logística, árvore de decisão ou random forest, com atualização periódica conforme os dados do Stripe.

---

## 🧱 Arquitetura Técnica

| Camada | Tecnologia | Função |
|--------|-------------|--------|
| Frontend | Next.js + Tailwind | Interface do usuário |
| Backend | Node.js + TypeScript (Express) | API principal e integração Stripe |
| Auth | BetterAuth | Autenticação e controle de acesso |
| Blockchain | Solidity / EVM | Contratos inteligentes on-chain |
| Banco de Dados | PostgreSQL + Prisma | Persistência e auditoria |
| ML Engine | Python + Scikit-learn | Motor de score financeiro |
| Pagamentos | Stripe Connect + OAuth 2.0 | Billing, repasses e scoring |
| Infra | Docker + AWS KMS | Segurança e deploy |

---

## 💳 Integração com Stripe

A plataforma utiliza **Stripe Connect + OAuth 2.0** em dois estágios distintos:

1. **Fase de Monitoramento (`scope=read_only`)**  
   Leitura de faturamento e dados financeiros (para scoring e auditoria).

2. **Fase de Repasse (`scope=read_write`)**  
   Após contrato on-chain, ativa a permissão para criar cobranças e repasses automáticos.

### 🔄 Principais Operações Stripe
- Criar contratos e repasses automáticos
- Calcular e atualizar o MRR mensalmente
- Registrar transações e auditorias via webhooks
- Armazenar tokens cifrados (KMS)

---

## 🌐 Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto com as seguintes chaves:

```bash
# ==========================================
# 🧭 Stripe Configuration (Local Dev)
# ==========================================

STRIPE_SECRET_KEY="sk_test_51P7w2L9S8AbcDeFgHiJkLmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXy1aB"
STRIPE_PUBLISHABLE_KEY="pk_test_51P7w2L9S8AbcDeFgHiJkLmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXy2bC"
STRIPE_CLIENT_ID="ca_N3s4Xy9LqZbE8rH2uFv1dP0qR7W5kJ6t"
STRIPE_WEBHOOK_SECRET="whsec_2f9e7b3b1d4c6a5f8e9d0b2a7c3d5f1a"

# 🌐 URL base da API da sua plataforma (modo local)
STRIPE_API_BASE="http://localhost:3000/api"

# 🧠 Conta principal (Stripe Connect)
STRIPE_CONNECT_ACCOUNT_ID="acct_1P9xYt2uFvW5kJ6t"
````

---

## 🪙 Contratos Inteligentes (Solidity)

Cada rodada de investimento gera um **smart contract único**, que registra:

* Founder e investidores participantes
* Valores e percentuais de participação
* Flag `roundOpen` para controle de encerramento
* Assinaturas digitais para validação legal

O backend sincroniza os dados do contrato on-chain com o banco e o Stripe para auditoria completa.

---

## 🧩 Componentes Técnicos Principais

* **OAuth Endpoint** — Gera a URL de autorização Stripe (read_only/read_write)
* **Callback Endpoint** — Recebe o `code` e troca por tokens de acesso
* **Webhook Handler** — Recebe eventos do Stripe (pagamentos, repasses, falhas)
* **Smart Contract Manager** — Gera e atualiza contratos Solidity por rodada
* **Job Scheduler** — Executa cálculos mensais de MRR e atualiza score dos founders

---

## 🧠 Segurança e Boas Práticas

1. 🔒 **Criptografia de Tokens** — Todos os tokens Stripe são armazenados cifrados via KMS.
2. 🧩 **Mínimo Privilégio** — `read_only` para scoring, `read_write` apenas após contrato.
3. 🪪 **Validação OAuth State** — Protege contra CSRF.
4. 📜 **Auditoria Completa** — Logs de repasses vinculados a smart contracts.
5. 🧱 **Rotação de Chaves** — Seguir práticas de segurança recomendadas pela Stripe.

---

## ⚡ Como Rodar Localmente

```bash
# 1. Clonar repositório
git clone https://github.com/suaorg/plataforma-p2p-finance.git
cd plataforma-p2p-finance

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Rodar servidor
npm run dev
```

> ⚙️ O motor de score (Python) roda como serviço separado.
> Configure-o com `uvicorn app.main:app --reload` (FastAPI).

---

## 📚 Documentação Oficial

* [Stripe Connect OAuth Reference](https://docs.stripe.com/connect/oauth-reference)
* [Stripe Destination Charges](https://docs.stripe.com/connect/destination-charges)
* [Stripe Transfers API](https://docs.stripe.com/api/transfers)
* [Stripe Webhooks](https://docs.stripe.com/webhooks)
* [Stripe Key Management](https://docs.stripe.com/keys-best-practices)
* [Scikit-learn Documentation](https://scikit-learn.org/stable/)
* [BetterAuth Documentation](https://better-auth.vercel.app/docs)

---

## 👥 Equipe & Créditos

Desenvolvido por **[sua equipe]**, com arquitetura híbrida e escalável:

* 🧑‍💻 **Next.js + Node.js** — frontend e backend integrados
* ⚙️ **Solidity** — contratos on-chain
* 🤖 **Python (ML)** — motor de score financeiro
* 💳 **Stripe Connect** — pagamentos inteligentes
* 🧩 **BetterAuth** — autenticação e controle de acesso

---

> 🏗️ *Este projeto representa a nova geração de plataformas P2P inteligentes, unindo blockchain, inteligência artificial e infraestrutura financeira moderna.*

```

---

Deseja que eu gere também o arquivo `.env.example` e o `package.json` base para combinar com esse README (pronto pra deploy/local run)?
```
