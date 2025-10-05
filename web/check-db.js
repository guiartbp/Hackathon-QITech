import { PrismaClient } from './src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    // Verificar tabelas principais
    const investidoresCount = await prisma.investidor.count()
    const empresasCount = await prisma.empresa.count()
    const contratosCount = await prisma.contrato.count()
    const stripeAccountsCount = await prisma.stripeConnectedAccount.count()
    const repasseLogsCount = await prisma.repasseLog.count()
    
    console.log('📊 Contagem de dados no banco:')
    console.log(`   • Investidores: ${investidoresCount}`)
    console.log(`   • Empresas: ${empresasCount}`)
    console.log(`   • Contratos: ${contratosCount}`)
    console.log(`   • Contas Stripe: ${stripeAccountsCount}`)
    console.log(`   • Logs de Repasse: ${repasseLogsCount}`)
    
    if (investidoresCount > 0) {
      console.log('✅ Dados encontrados no banco!')
    } else {
      console.log('⚠️  Banco vazio - execute o seeder')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()