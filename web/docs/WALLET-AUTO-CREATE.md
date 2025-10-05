# Criação Automática de Wallet no Onboarding do Investidor

## Resumo

Implementação de criação automática de carteira (wallet) com saldo R$ 0,00 quando o investidor finaliza o onboarding, independentemente da estratégia escolhida (Carteira IA ou Credit Picking).

## Arquivos Criados/Modificados

### 1. Novo Endpoint: `/api/wallets/create` (POST)

**Arquivo**: `/src/app/(backend)/api/wallets/create/route.ts`

**Função**: Cria uma wallet para o usuário autenticado com saldo inicial R$ 0,00

**Fluxo**:

1. Verifica autenticação via session
2. Checa se o usuário já possui uma wallet
3. Se já existir, retorna a wallet existente
4. Se não existir, cria nova wallet com valores zerados

**Response de Sucesso**:

```json
{
  "success": true,
  "wallet": {
    "id": "uuid",
    "uidUsuario": "user-id",
    "saldoAtual": 0,
    "disponivelSaque": 0,
    "valorBloqueado": 0,
    "criadoEm": "2025-10-05T...",
    "atualizadoEm": "2025-10-05T..."
  },
  "message": "Carteira criada com sucesso"
}
```

**Response se já existe**:

```json
{
  "success": true,
  "wallet": {...},
  "message": "Carteira já existe"
}
```

### 2. Página de Onboarding Atualizada

**Arquivo**: `/src/app/(frontend)/(auth)/cadastro/in/onboarding/page.tsx`

**Mudanças na função `handleFinalizar()`**:

```typescript
// ANTES: Apenas salvava dados do investidor
await fetch('/api/onboarding/investor/complete', {...});
toast.success('Cadastro enviado com sucesso! 🎉');

// DEPOIS: Salva dados E cria wallet automaticamente
// 1. Salvar dados do investidor
await fetch('/api/onboarding/investor/complete', {...});

// 2. Criar wallet com saldo R$ 0
await fetch('/api/wallets/create', { method: 'POST' });

toast.success('Cadastro e carteira criados com sucesso! 🎉');
```

**Tratamento de Erros**:

- Se a criação da wallet falhar, **não bloqueia** o fluxo do onboarding
- Apenas loga o erro no console
- Usuário ainda é redirecionado para página de sucesso
- Wallet pode ser criada posteriormente se necessário

## Estrutura do Banco de Dados

**Tabela**: `carteiras` (Wallets)

```sql
CREATE TABLE carteiras (
  id UUID PRIMARY KEY,
  uid_usuario VARCHAR UNIQUE,  -- FK para o usuário (better-auth)
  saldo_atual DECIMAL(15,2) DEFAULT 0,
  disponivel_saque DECIMAL(15,2) DEFAULT 0,
  valor_bloqueado DECIMAL(15,2) DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

**Valores Iniciais**:

- `saldoAtual`: `0.00`
- `disponivelSaque`: `0.00`
- `valorBloqueado`: `0.00`

## Fluxo Completo do Onboarding

```
1. Investidor completa todos os steps (1-6)
   ↓
2. No Step 7, escolhe estratégia:
   - [Carteira IA] ou [Credit Picking]
   ↓
3. Clica em "Criar Carteira IA →" ou "Ir para Marketplace →"
   ↓
4. handleFinalizar() executa:
   ├─ Salva dados no localStorage
   ├─ POST /api/onboarding/investor/complete
   │  └─ Cria registro de Investidor no banco
   ├─ POST /api/wallets/create
   │  └─ Cria Wallet com saldo R$ 0
   └─ Redireciona para página de sucesso
   ↓
5. Usuário é redirecionado:
   - IA: /cadastro/in/sucesso?strategy=ia
   - Picking: /cadastro/in/sucesso?strategy=picking
```

## Segurança

✅ **Autenticação Obrigatória**: Endpoint requer sessão válida via `better-auth`

✅ **Unicidade**: Verifica se usuário já possui wallet antes de criar

✅ **Isolamento**: Cada usuário tem apenas uma wallet (constraint `UNIQUE` em `uid_usuario`)

✅ **Valores Seguros**: Wallet sempre criada com saldo 0 (não aceita valores via request)

## Próximos Passos Sugeridos

1. **Depósito Inicial**: Permitir que investidor adicione saldo após onboarding
2. **KYC/Compliance**: Validar documentos antes de permitir depósitos
3. **Notificação**: Enviar email confirmando criação da carteira
4. **Dashboard**: Mostrar saldo da wallet na dashboard do investidor
5. **Histórico**: Listar todas as transações da wallet

## Testando

### 1. Teste Manual

```bash
# 1. Fazer cadastro como investidor
# 2. Completar steps 1-6
# 3. No step 7, escolher estratégia (IA ou Picking)
# 4. Clicar em "Criar Carteira IA" ou "Ir para Marketplace"
# 5. Verificar no banco:

SELECT * FROM carteiras
WHERE uid_usuario = 'SEU_USER_ID'
ORDER BY criado_em DESC;

# Deve retornar:
# - saldo_atual = 0.00
# - disponivel_saque = 0.00
# - valor_bloqueado = 0.00
```

### 2. Teste via API (Postman/Bruno)

```bash
POST /api/wallets/create
Headers:
  Cookie: better-auth.session_token=...

# Response esperado:
{
  "success": true,
  "wallet": {
    "id": "...",
    "uidUsuario": "...",
    "saldoAtual": 0,
    ...
  },
  "message": "Carteira criada com sucesso"
}
```

## Observações

⚠️ **Idempotência**: Chamar `/api/wallets/create` múltiplas vezes é seguro - retorna a wallet existente sem erro

⚠️ **Sincronização**: Wallet é criada **após** o investidor ser salvo no banco (ordem importante)

⚠️ **Performance**: Operação assíncrona - não bloqueia UI durante criação

✅ **Compatibilidade**: Funciona tanto para estratégia IA quanto Credit Picking
