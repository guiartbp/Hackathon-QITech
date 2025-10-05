#!/bin/bash
# Script para restaurar o banco de dados após problema

echo "🔧 Iniciando restauração do banco de dados..."
echo ""

# 1. Verificar conexão
echo "📡 Testando conexão com o banco..."
if npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | grep -q "error"; then
  echo "❌ Não foi possível conectar ao banco de dados."
  echo "Por favor, verifique:"
  echo "  1. O Supabase está ativo no dashboard"
  echo "  2. A DATABASE_URL está correta no arquivo .env"
  exit 1
fi

echo "✅ Conexão estabelecida!"
echo ""

# 2. Restaurar schema
echo "🗄️  Aplicando schema ao banco de dados..."
npx prisma db push --accept-data-loss --skip-generate

if [ $? -eq 0 ]; then
  echo "✅ Schema aplicado com sucesso!"
else
  echo "❌ Erro ao aplicar schema"
  exit 1
fi
echo ""

# 3. Gerar Prisma Client
echo "⚙️  Gerando Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
  echo "✅ Prisma Client gerado!"
else
  echo "❌ Erro ao gerar Prisma Client"
  exit 1
fi
echo ""

# 4. Popular com dados de teste (opcional)
echo "📊 Deseja popular o banco com dados de teste? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Executando seed..."
  pnpm db:seed
fi

echo ""
echo "✨ Banco de dados restaurado com sucesso!"
echo ""
echo "⚠️  IMPORTANTE: Todos os dados anteriores foram perdidos."
echo "   O banco agora está com o schema correto mas vazio."
