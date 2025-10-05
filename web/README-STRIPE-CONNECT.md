# Sistema Híbrido: Smart Contract + Stripe Connect

Este sistema implementa a arquitetura híbrida descrita no relatório, onde:

- **Smart Contracts** são usados para **assinatura legal** dos termos de investimento
- **Stripe Connect** é usado para **leitura de métricas** (scoring/monitoramento) e **repasses financeiros**

## 🏗️ Arquitetura do Sistema

### Componentes Principais

1. **Smart Contract (`InvestmentRound.sol`)**
   - Registro de investidores e termos
   - Assinatura on-chain dos termos
   - Validação legal e auditoria

2. **Stripe Connect Integration**
   - OAuth com scopes `read_only` e `read_write`
   - Monitoramento de MRR, churn, métricas
   - Execução de repasses via transfers/destination charges

3. **Backend APIs**
   - OAuth flow (`/api/stripe/authorize`, `/api/stripe/callback`)
   - Webhook handler (`/api/stripe/webhook`)
   - Repasse service (`/api/stripe/repasse`)

4. **Frontend Components**
   - Botões de conexão Stripe
   - Dashboard de status
   - Interface de gerenciamento

## 🔧 Configuração

### 1. Variáveis de Ambiente

```bash
# Database
DATABASE_URL="postgresql://..."

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."           # Sua chave secreta
STRIPE_PUBLISHABLE_KEY="pk_test_..."      # Sua chave pública
STRIPE_CLIENT_ID="ca_..."                 # Client ID do Connect
STRIPE_WEBHOOK_SECRET="whsec_..."         # Secret do webhook

# Crypto
ENCRYPTION_KEY="your-32-character-key"     # Para criptografar tokens

# Blockchain
SEPOLIA_URL="https://..."
PRIVATE_KEY="0x..."
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."       # Após deploy do contrato

# App
BETTER_AUTH_URL="http://localhost:3000"
```

### 2. Setup do Stripe Connect

1. **Criar aplicação Connect no Stripe Dashboard**
   - Vá para: Settings > Connect > Platforms
   - Crie uma nova plataforma
   - Obtenha o `client_id`

2. **Configurar OAuth Settings**
   - Redirect URI: `http://localhost:3000/api/stripe/callback`
   - Webhook URL: `http://localhost:3000/api/stripe/webhook`

3. **Configurar Webhooks**
   - Eventos relevantes:
     - `payment_intent.succeeded`
     - `transfer.created`
     - `account.updated`
     - `charge.succeeded`

### 3. Database Setup

```bash
# Gerar Prisma client
pnpm prisma generate

# Executar migrações
pnpm prisma db push

# (Opcional) Visualizar dados
pnpm prisma studio
```

### 4. Deploy do Smart Contract

```bash
# Compilar contratos
pnpm hardhat compile

# Deploy no testnet (Sepolia)
pnpm hardhat run scripts/deploy-investment-round.ts --network sepolia

# Adicionar endereço do contrato no .env.local
```

## 📋 Fluxo de Uso

### Para Tomadores (Empresas)

1. **Conexão Read-Only** (Monitoramento)

   ```tsx
   <StripeConnectButton
     userId={tomadorId}
     userType="TOMADOR"
     scope="read_only"
   />
   ```

   - Permite leitura de dados de faturamento
   - Cálculo de MRR, churn, métricas
   - Scoring creditício contínuo

2. **Conexão Read-Write** (após assinatura do contrato)
   ```tsx
   <StripeConnectButton
     userId={tomadorId}
     userType="TOMADOR"
     scope="read_write"
   />
   ```

   - Permite criar charges para repasses
   - Executar transferências

### Para Investidores

1. **Registro no Smart Contract**

   ```solidity
   // Owner adiciona investidor
   investmentRound.addInvestor(
     investorAddress,
     investorId,
     investmentAmount,
     percentage
   );
   ```

2. **Assinatura dos Termos On-Chain**

   ```solidity
   // Investidor assina pessoalmente
   investmentRound.signTerms();
   ```

3. **Conexão Stripe para Repasses**
   ```tsx
   <StripeConnectButton
     userId={investorId}
     userType="INVESTIDOR"
     scope="read_write"
   />
   ```

### Execução de Repasses

```typescript
// Processar repasses baseado no smart contract
const results = await repasseService.processInvestmentRepasses(
  smartContractId,
  totalAmountCents,
  "transfer" // ou 'destination_charge'
);
```

## 🔌 APIs Disponíveis

### Stripe OAuth

- **POST** `/api/stripe/authorize` - Gerar URL de autorização
- **GET** `/api/stripe/callback` - Callback OAuth

### Repasses

- **POST** `/api/stripe/repasse`
  - `action: 'process_investment_repasses'`
  - `action: 'create_destination_charge'`
  - `action: 'create_transfer'`
  - `action: 'fetch_account_data'`
  - `action: 'calculate_metrics'`

### Webhooks

- **POST** `/api/stripe/webhook` - Processar eventos Stripe

## 📊 Monitoramento e Métricas

### Jobs Mensais (TODO)

```typescript
// Coletar dados mensais usando tokens read_only
const metrics = await repasseService.calculateAccountMetrics(
  connectedAccountId,
  startDate,
  endDate
);

// Salvar no StripeMonitoringData
```

### Métricas Coletadas

- MRR (Monthly Recurring Revenue)
- Churn Rate
- Novos clientes
- Volume de transações
- Taxa de sucesso de pagamentos

## 🔐 Segurança

### Tokens Criptografados

- Todos os access_tokens são criptografados com AES-256
- Chave de criptografia deve ter exatamente 32 caracteres
- Armazenamento seguro com salt e IV únicos

### Validação de Estado OAuth

- State CSRF protection
- Verificação de assinatura de webhooks
- Validação de capabilities antes de executar repasses

## 🚀 Deploy e Produção

### Checklist Pré-Deploy

- [ ] Configurar variáveis de ambiente de produção
- [ ] Deploy do smart contract na mainnet
- [ ] Configurar webhook URL público
- [ ] Testar fluxo completo em staging
- [ ] Configurar monitoramento de logs
- [ ] Setup de backup de database

### Monitoramento Produção

- Logs de webhooks em `StripeWebhookEvent`
- Auditoria de repasses em `RepasseLog`
- Métricas de performance
- Alertas para falhas de pagamento

## 🧪 Testes

### Testes Locais

```bash
# Iniciar em modo desenvolvimento
pnpm dev

# Testar conexão Stripe (modo teste)
# Usar cartões de teste da Stripe

# Testar webhooks com Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Cenários de Teste

1. Conexão read_only → Leitura de métricas
2. Conexão read_write → Execução de transfers
3. Smart contract → Adição de investidores e assinatura
4. Webhook events → Processamento de eventos
5. Fluxo completo → Investimento → Assinatura → Repasse

## 📚 Referências

### Documentação Oficial

- [Stripe Connect OAuth](https://docs.stripe.com/connect/oauth-reference)
- [PaymentIntents API](https://docs.stripe.com/api/payment_intents)
- [Transfers API](https://docs.stripe.com/api/transfers)
- [Webhooks](https://docs.stripe.com/webhooks)
- [Destination Charges](https://docs.stripe.com/connect/destination-charges)

### Boas Práticas

- [Managing API Keys](https://docs.stripe.com/keys-best-practices)
- [Account Capabilities](https://docs.stripe.com/connect/account-capabilities)

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

## 📝 TODO

### Próximas Implementações

- [ ] Jobs automatizados de coleta mensal
- [ ] Interface para visualização de métricas
- [ ] Sistema de notificações
- [ ] Dashboard de admin para gerenciar conexões
- [ ] Testes automatizados
- [ ] Documentação de API (Swagger)
- [ ] Monitoramento com Sentry/DataDog

### Melhorias de Segurança

- [ ] Rate limiting nas APIs
- [ ] Logging estruturado
- [ ] Validação de input mais rigorosa
- [ ] Auditoria de acessos
- [ ] Rotação automática de tokens
