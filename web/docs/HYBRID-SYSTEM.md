# Sistema Híbrido: Smart Contract + Stripe Connect

Este projeto implementa um sistema híbrido que combina **smart contracts** para assinatura de termos legais com **Stripe Connect** para processamento de pagamentos e monitoramento financeiro.

## 🏗️ Arquitetura

### Componentes Principais

1. **Smart Contracts** (Blockchain)
   - Assinatura digital de termos e condições
   - Registro imutável de acordos de investimento
   - Validação de participantes

2. **Stripe Connect** (Off-chain)
   - Processamento de pagamentos
   - Distribuição de lucros (repasses)
   - Monitoramento de receitas (MRR/ARR)
   - Análise de churn e métricas financeiras

## 📁 Estrutura do Projeto

```
├── contracts/
│   └── InvestmentRound.sol          # Smart contract principal
├── scripts/
│   ├── deploy-investment-round.ts   # Deploy do contrato
│   └── stripe-monitoring-cron.js    # Job automatizado de monitoramento
├── src/
│   ├── app/api/stripe/
│   │   ├── authorize/route.ts       # OAuth Stripe Connect
│   │   ├── callback/route.ts        # Callback OAuth
│   │   ├── webhook/route.ts         # Webhooks Stripe
│   │   └── monitoring/route.ts      # API de monitoramento
│   ├── components/stripe/
│   │   ├── stripe-connect-button.tsx           # Botão de conexão
│   │   ├── stripe-connections-dashboard.tsx    # Dashboard de conexões
│   │   └── stripe-monitoring-dashboard.tsx     # Dashboard de monitoramento
│   └── lib/
│       ├── crypto.ts                # Criptografia de tokens
│       ├── stripe-oauth.ts          # Utilitários OAuth
│       ├── stripe-repasse-service.ts       # Serviço de repasses
│       └── stripe-monitoring-service.ts    # Serviço de monitoramento
├── prisma/
│   └── schema.prisma               # Schema do banco de dados
└── .env.local                      # Variáveis de ambiente
```

## 🚀 Como Funciona

### 1. Assinatura de Termos (Smart Contract)

```typescript
// Exemplo de uso do smart contract
const contract = new ethers.Contract(contractAddress, abi, signer);

// Assinar termos como investidor
await contract.signAsInvestor(roundId, investmentAmount, {
  value: investmentAmount,
});

// Verificar assinatura
const hasSigned = await contract.hasSignedTerms(roundId, investorAddress);
```

### 2. Conexão Stripe Connect

```typescript
// Autorizar conta Stripe
const authUrl = await generateStripeAuthUrl(userId, returnUrl);
// Redirecionar usuário para authUrl

// Após callback, tokens são armazenados criptografados
const tokens = await handleStripeCallback(code, state);
```

### 3. Processamento de Repasses

```typescript
import { repasseService } from "@/lib/stripe-repasse-service";

// Executar repasse baseado em contrato
await repasseService.executeRepasse({
  contractAddress: "0x...",
  roundId: 1,
  totalAmount: 100000, // em centavos
  description: "Repasse mensal - Rodada Series A",
});
```

### 4. Monitoramento Financeiro

```typescript
import { monitoringService } from "@/lib/stripe-monitoring-service";

// Job mensal automático
const results = await monitoringService.runMonthlyJob();

// Gerar relatório específico
const report = await monitoringService.generateMonitoringReport(
  connectedAccountId,
  6 // últimos 6 meses
);
```

## 📊 Métricas Monitoradas

### MRR (Monthly Recurring Revenue)

- Cálculo baseado em assinaturas ativas
- Crescimento mês a mês
- Projeções de tendência

### Churn Analysis

- Taxa de cancelamento de clientes
- Churn de receita
- Identificação de padrões

### Customer Metrics

- Total de clientes ativos
- Novos clientes por período
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_CLIENT_ID=ca_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Blockchain
PRIVATE_KEY=0x...
INFURA_PROJECT_ID=...
ETHERSCAN_API_KEY=...

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
CRYPTO_ALGORITHM=aes-256-gcm

# Database
DATABASE_URL=postgresql://...

# Next.js
NEXTJS_URL=http://localhost:3000
```

### 2. Deploy do Smart Contract

```bash
# Instalar dependências
npm install

# Compilar contratos
npx hardhat compile

# Deploy em testnet
npx hardhat run scripts/deploy-investment-round.ts --network sepolia

# Verificar no Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### 3. Configurar Database

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma migrate dev --name init

# Visualizar dados (opcional)
npx prisma studio
```

### 4. Configurar Webhooks Stripe

1. Acesse o Dashboard do Stripe
2. Vá em **Developers > Webhooks**
3. Adicione endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Selecione eventos:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `checkout.session.completed`

## 🤖 Automatização

### Job Mensal de Monitoramento

```bash
# Executar manualmente
node scripts/stripe-monitoring-cron.js

# Configurar cron (todo dia 1° às 02:00)
0 2 1 * * /usr/bin/node /path/to/your/project/scripts/stripe-monitoring-cron.js
```

### Monitoramento em Tempo Real

O sistema processa webhooks do Stripe automaticamente, atualizando:

- Status de pagamentos
- Dados de assinatura
- Métricas de clientes
- Logs de repasse

## 📱 Interface de Usuário

### Dashboard de Conexões Stripe

```jsx
import { StripeConnectionsDashboard } from "@/components/stripe/stripe-connections-dashboard";

<StripeConnectionsDashboard
  userId={currentUser.id}
  onConnectionSuccess={(account) => console.log("Connected:", account)}
/>;
```

### Dashboard de Monitoramento

```jsx
import { StripeMonitoringDashboard } from "@/components/stripe/stripe-monitoring-dashboard";

<StripeMonitoringDashboard
  connectedAccountId="acct_..."
  showAllAccounts={false}
/>;
```

### Botão de Conexão

```jsx
import { StripeConnectButton } from "@/components/stripe/stripe-connect-button";

<StripeConnectButton
  userId={user.id}
  returnUrl="/dashboard/stripe"
  variant="default"
/>;
```

## 🔒 Segurança

### Criptografia de Tokens

- Tokens Stripe são criptografados usando AES-256-GCM
- Chave de criptografia única por ambiente
- Rotação de chaves recomendada periodicamente

### Validação de Webhooks

- Verificação de assinatura Stripe
- Rate limiting implementado
- Logs de segurança detalhados

### Smart Contract Security

- Reentrancy guards
- Access control (onlyOwner, onlyInvestor)
- Validação de entrada rigorosa

## 📈 Monitoramento e Logs

### Logs da Aplicação

```bash
# Logs do job de monitoramento
tail -f logs/stripe-monitoring.log

# Logs do webhook
tail -f logs/stripe-webhook.log
```

### Health Checks

```bash
# Verificar status do serviço
curl http://localhost:3000/api/stripe/monitoring?action=health

# Status das conexões
curl http://localhost:3000/api/stripe/monitoring?action=status
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de Criptografia**

   ```
   Verifique se ENCRYPTION_KEY tem exatamente 32 caracteres
   ```

2. **Webhook não funciona**

   ```bash
   # Testar webhook localmente com Stripe CLI
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. **Smart Contract não deploya**

   ```bash
   # Verificar saldo da carteira
   npx hardhat run scripts/check-balance.ts --network sepolia
   ```

4. **MRR calculado incorretamente**
   ```
   Verifique se os metadata dos charges/subscriptions estão corretos
   ```

## 🚀 Deploy em Produção

### 1. Configurar Variáveis

- Use chaves Stripe de produção
- Configure NEXTJS_URL correto
- Use rede Ethereum mainnet

### 2. Configurar Infraestrutura

```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start

# Ou usar PM2
pm2 start ecosystem.config.js
```

### 3. Configurar SSL

- HTTPS obrigatório para webhooks Stripe
- Certificado SSL válido
- Redirecionamento HTTP → HTTPS

### 4. Backup e Monitoramento

- Backup automático do banco
- Monitoramento de uptime
- Alertas de erro por email/Slack

## 📚 Referências

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para automatizar investimentos e repasses de forma segura e transparente.**
