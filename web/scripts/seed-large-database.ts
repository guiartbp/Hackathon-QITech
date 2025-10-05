import { PrismaClient } from '../src/generated/prisma'
import { faker } from '@faker-js/faker'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

// Configuração para idioma português brasileiro
faker.locale = 'pt_BR'

// Constantes para controle
const BATCH_SIZE = 100 // Inserir em lotes para performance
const TARGET_COUNTS = {
  investidores: 1000,
  empresas: 200,
  tomadores: 200, 
  propostas: 500,
  contratos: 300,
  investimentos: 1500,
  metricas_mensais: 4800, // 200 empresas * 24 meses
  metricas_tempo_real: 1000,
  pagamentos: 3000,
  repasses: 2000,
  repasse_logs: 5000,
  wallets: 1200,
  wallet_transactions: 8000,
  stripe_connected_accounts: 150,
  smart_contracts: 100,
  historico_financeiro: 2400, // 200 empresas * 12 meses
  top_clientes: 6000, // 200 empresas * 30 clientes
}

// Função para gerar CPF válido
function generateCPF(): string {
  const cpf = faker.number.int({ min: 10000000000, max: 99999999999 }).toString()
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Função para gerar CNPJ válido
function generateCNPJ(): string {
  const cnpj = faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString()
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

// Função para dividir array em lotes
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Mock data expandido
const SETORES_EMPRESAS = [
  'FINTECH', 'HEALTHTECH', 'EDTECH', 'PROPTECH', 'AGTECH', 'RETAILTECH', 
  'LOGISTICS', 'INSURTECH', 'LEGALTECH', 'HRTECH', 'MARTECH', 'CLEANTECH',
  'FOODTECH', 'MOBILITY', 'GAMING', 'CYBERSECURITY', 'BLOCKCHAIN', 'AI_ML'
]

const EMPRESAS_NOMES = [
  'TechFlow', 'GreenPay', 'EduLearn', 'HealthConnect', 'SmartLog', 'PropVision',
  'AgroSmart', 'RetailBox', 'InsureTech', 'LegalBot', 'HRGenius', 'MarketPro',
  'EcoSolutions', 'FoodDelivery', 'RideShare', 'GameStudio', 'SecureNet', 'BlockChain',
  'AIAssist', 'DataMining', 'CloudTech', 'IoTSolutions', 'VRExperience', 'ARReality',
  'BioTech', 'NanoTech', 'RoboTech', 'QuantumComputing', 'SpaceTech', 'OceanTech'
]

async function clearDatabase() {
  console.log('🧹 Limpando dados existentes...')
  
  const deleteOrder = [
    'walletTransaction', 'wallet', 'repasseLog', 'repasse', 'pagamento', 
    'investimento', 'contrato', 'proposta', 'metricasTempoReal', 'metricasMensais',
    'topClientes', 'historicoFinanceiro', 'stripeMonitoringData', 'stripeConnectedAccount',
    'smartContract', 'investorSignature', 'empresa', 'tomador', 'investidor',
    'auditLog', 'dadosBancarios', 'insight', 'score', 'scoreCategoria', 'scoreFeature',
    'scoreRecomendacao', 'cohorts', 'evolucaoMetricas', 'mrrPorPlano', 'projecaoPagamento',
    'stripeWebhookEvent'
  ]

  for (const table of deleteOrder) {
    try {
      await (prisma as any)[table].deleteMany({})
    } catch (error) {
      console.log(`⚠️ Tabela ${table} não encontrada ou já vazia`)
    }
  }
}

async function seedInvestidores() {
  console.log('👥 Criando investidores em lotes...')
  
  const investidoresData = []
  
  for (let i = 0; i < TARGET_COUNTS.investidores; i++) {
    const tipoPessoa = faker.helpers.arrayElement(['PF', 'PJ'])
    
    investidoresData.push({
      uidUsuario: faker.string.uuid(),
      tipoPessoa,
      documentoIdentificacao: tipoPessoa === 'PF' ? generateCPF() : generateCNPJ(),
      nomeRazaoSocial: tipoPessoa === 'PF' ? faker.person.fullName() : faker.company.name(),
      dataOnboarding: faker.date.past({ years: 2 }),
      patrimonioLiquido: new Decimal(faker.number.int({ min: 100000, max: 50000000 })),
      declaracaoRisco: faker.datatype.boolean(),
      experienciaAtivosRisco: faker.datatype.boolean(),
      modeloInvestimento: faker.helpers.arrayElement(['CONSERVADOR', 'MODERADO', 'AGRESSIVO']),
      fonteRecursos: faker.helpers.arrayElement(['SALARIO', 'INVESTIMENTOS', 'HERANCA', 'EMPRESA']),
      statusKyc: faker.helpers.arrayElement(['PENDENTE', 'APROVADO', 'REPROVADO']),
    })
  }

  // Inserir em lotes
  const chunks = chunkArray(investidoresData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.investidor.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.investidores} investidores`)
  }

  return await prisma.investidor.findMany({ select: { id: true } })
}

async function seedTomadoresEEmpresas() {
  console.log('🏢 Criando tomadores e empresas em lotes...')
  
  const tomadoresData = []
  const empresasData = []
  
  for (let i = 0; i < TARGET_COUNTS.empresas; i++) {
    const tomadorId = faker.string.uuid()
    const empresaNome = faker.helpers.arrayElement(EMPRESAS_NOMES)
    
    tomadoresData.push({
      id: tomadorId,
      uidUsuario: faker.string.uuid(),
      nomeCompleto: faker.person.fullName(),
      email: faker.internet.email(),
      statusCompliance: faker.helpers.arrayElement(['PENDENTE', 'APROVADO', 'EM_ANALISE']),
    })

    empresasData.push({
      tomadorId: tomadorId,
      razaoSocial: `${empresaNome} Ltda`,
      nomeFantasia: `${empresaNome} ${faker.helpers.arrayElement(['Solutions', 'Tech', 'Labs', 'Systems', 'Pro', 'Digital'])}`,
      cnpj: generateCNPJ(),
      setor: faker.helpers.arrayElement(SETORES_EMPRESAS),
      estagioInvestimento: faker.helpers.arrayElement(['PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'GROWTH']),
      descricaoCurta: faker.company.catchPhrase(),
      descricaoCompleta: faker.lorem.paragraphs(3),
      website: faker.internet.url(),
      dataFundacao: faker.date.past({ years: 10 }),
      numeroFuncionarios: faker.number.int({ min: 5, max: 500 }),
    })
  }

  // Criar tomadores primeiro
  const tomadorChunks = chunkArray(tomadoresData, BATCH_SIZE)
  for (const chunk of tomadorChunks) {
    await prisma.tomador.createMany({ data: chunk })
  }

  // Depois criar empresas
  const empresaChunks = chunkArray(empresasData, BATCH_SIZE)
  let totalCreated = 0
  for (const chunk of empresaChunks) {
    await prisma.empresa.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.empresas} empresas`)
  }

  return await prisma.empresa.findMany({ select: { id: true, tomadorId: true } })
}

async function seedMetricasMensais(empresas: Array<{id: string}>) {
  console.log('📈 Criando métricas mensais (24 meses por empresa)...')
  
  const metricasData = []
  
  for (const empresa of empresas) {
    const baseMrr = faker.number.int({ min: 10000, max: 500000 })
    
    for (let mes = 0; mes < 24; mes++) {
      const dataRef = new Date()
      dataRef.setMonth(dataRef.getMonth() - mes)
      
      const growth = Math.pow(1.05, mes) // 5% crescimento por mês no passado
      const mrr = new Decimal(baseMrr * growth)
      
      metricasData.push({
        empresaId: empresa.id,
        mesReferencia: dataRef,
        mrrFinal: mrr,
        mrrMedio: mrr.mul(0.95),
        arrFinal: mrr.mul(12),
        nrrMensal: new Decimal(faker.number.int({ min: 95, max: 120 })),
        numClientesInicio: faker.number.int({ min: 50, max: 1000 }),
        numClientesFinal: faker.number.int({ min: 50, max: 1000 }),
        novosClientes: faker.number.int({ min: 5, max: 100 }),
        clientesCancelados: faker.number.int({ min: 2, max: 50 }),
        investimentoMarketingVendas: mrr.mul(faker.number.int({ min: 20, max: 40 }) / 100),
        cacPago: new Decimal(faker.number.int({ min: 100, max: 2000 })),
        ltvMedio: new Decimal(faker.number.int({ min: 1000, max: 10000 })),
        ltvCacRatio: new Decimal(faker.number.int({ min: 3, max: 15 })),
        ticketMedio: mrr.div(faker.number.int({ min: 50, max: 500 })),
        receitaTotal: mrr.mul(faker.number.int({ min: 90, max: 110 }) / 100),
        opexMensal: mrr.mul(faker.number.int({ min: 60, max: 120 }) / 100),
        netBurnMensal: mrr.mul(faker.number.int({ min: -20, max: 40 }) / 100),
        cashBalanceFinal: new Decimal(faker.number.int({ min: 100000, max: 5000000 })),
        cashRunwayMeses: faker.number.int({ min: 6, max: 36 }),
        expansionMrr: mrr.mul(faker.number.int({ min: 5, max: 25 }) / 100),
        contractionMrr: mrr.mul(faker.number.int({ min: 2, max: 15 }) / 100),
        expansionPct: new Decimal(faker.number.int({ min: 10, max: 30 })),
        contractionPct: new Decimal(faker.number.int({ min: 5, max: 20 })),
        churnRateMedio: new Decimal(faker.number.int({ min: 2, max: 10 }) / 100),
        dscrAjustadoMensal: new Decimal(faker.number.int({ min: 1.2, max: 4.0 })),
        margemBruta: new Decimal(faker.number.int({ min: 60, max: 90 })),
        burnMultiple: new Decimal(faker.number.int({ min: 0.5, max: 3.0 })),
        cacPaybackMeses: faker.number.int({ min: 6, max: 24 }),
        magicNumber: new Decimal(faker.number.int({ min: 0.5, max: 2.0 })),
      })
    }
  }

  const chunks = chunkArray(metricasData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.metricasMensais.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${metricasData.length} métricas mensais`)
  }
}

async function seedMetricasTempoReal(empresas: Array<{id: string}>) {
  console.log('⏱️ Criando métricas em tempo real...')
  
  const metricasData = []
  
  for (let i = 0; i < TARGET_COUNTS.metricas_tempo_real; i++) {
    const empresa = faker.helpers.arrayElement(empresas)
    const mrrAtual = faker.number.int({ min: 10000, max: 500000 })
    
    metricasData.push({
      empresaId: empresa.id,
      timestampCaptura: faker.date.recent({ days: 30 }),
      mrr: new Decimal(mrrAtual),
      nrr: new Decimal(faker.number.int({ min: 95, max: 125 })),
      usuariosAtivos: faker.number.int({ min: 500, max: 20000 }),
      churnRate: new Decimal(faker.number.int({ min: 2, max: 12 }) / 100),
      opexMensal: new Decimal(mrrAtual * (faker.number.int({ min: 50, max: 120 }) / 100)),
      ltvCacAjustado: new Decimal(faker.number.int({ min: 2, max: 15 })),
      dscrAjustado: new Decimal(faker.number.int({ min: 1.0, max: 4.0 })),
    })
  }

  const chunks = chunkArray(metricasData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.metricasTempoReal.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.metricas_tempo_real} métricas tempo real`)
  }
}

async function seedPropostasInvestimentos(
  empresas: Array<{id: string}>, 
  investidores: Array<{id: string}>
) {
  console.log('💼 Criando propostas e investimentos...')
  
  // Criar propostas
  const propostasData = []
  for (let i = 0; i < TARGET_COUNTS.propostas; i++) {
    const empresa = faker.helpers.arrayElement(empresas)
    const valorSolicitado = faker.number.int({ min: 100000, max: 10000000 })
    
    propostasData.push({
      empresaId: empresa.id,
      valorSolicitado: new Decimal(valorSolicitado),
      multiploCap: new Decimal(faker.number.int({ min: 2.0, max: 5.0 })),
      percentualMrr: faker.number.int({ min: 5, max: 25 }),
      duracaoMeses: faker.number.int({ min: 12, max: 60 }),
      valorMinimoFunding: new Decimal(valorSolicitado * 0.3),
      planoUsoFundos: faker.lorem.paragraphs(2),
      statusFunding: faker.helpers.arrayElement(['ABERTA', 'FECHADA', 'CANCELADA']),
      valorFinanciado: new Decimal(faker.number.int({ min: valorSolicitado * 0.5, max: valorSolicitado })),
      progressoFunding: faker.number.int({ min: 30, max: 100 }),
      dataAbertura: faker.date.past({ years: 1 }),
      dataFechamento: faker.datatype.boolean() ? faker.date.recent({ days: 30 }) : null,
      diasAberta: faker.number.int({ min: 7, max: 90 }),
      scoreNaAbertura: faker.number.int({ min: 300, max: 850 }),
    })
  }

  const propostaChunks = chunkArray(propostasData, BATCH_SIZE)
  let totalCreated = 0
  for (const chunk of propostaChunks) {
    await prisma.proposta.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.propostas} propostas`)
  }

  const propostas = await prisma.proposta.findMany({ 
    select: { id: true, empresaId: true, valorSolicitado: true } 
  })

  // Criar investimentos
  const investimentosData = []
  for (let i = 0; i < TARGET_COUNTS.investimentos; i++) {
    const proposta = faker.helpers.arrayElement(propostas)
    const investidor = faker.helpers.arrayElement(investidores)
    const valorAportado = faker.number.int({ 
      min: Number(proposta.valorSolicitado) * 0.01, 
      max: Number(proposta.valorSolicitado) * 0.5 
    })
    
    investimentosData.push({
      propostaId: proposta.id,
      investidorId: investidor.id,
      valorAportado: new Decimal(valorAportado),
      percentualParticipacao: new Decimal(faker.number.int({ min: 1, max: 25 })),
      statusInvestimento: faker.helpers.arrayElement(['ATIVO', 'LIQUIDADO', 'CANCELADO']),
      valorTotalRecebido: new Decimal(valorAportado * faker.number.int({ min: 100, max: 300 }) / 100),
      tirRealizado: new Decimal(faker.number.int({ min: 5, max: 35 })),
      dataInvestimento: faker.date.past({ years: 2 }),
    })
  }

  const investimentoChunks = chunkArray(investimentosData, BATCH_SIZE)
  totalCreated = 0
  for (const chunk of investimentoChunks) {
    await prisma.investimento.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.investimentos} investimentos`)
  }

  return { propostas, investimentos: await prisma.investimento.findMany({ select: { id: true, propostaId: true } }) }
}

async function seedContratosEPagamentos(propostas: Array<{id: string, empresaId: string}>) {
  console.log('📋 Criando contratos e sistema de pagamentos...')
  
  // Criar contratos
  const contratosData = []
  const selectedPropostas = faker.helpers.arrayElements(propostas, TARGET_COUNTS.contratos)
  
  for (const proposta of selectedPropostas) {
    const valorPrincipal = faker.number.int({ min: 100000, max: 5000000 })
    
    contratosData.push({
      propostaId: proposta.id,
      empresaId: proposta.empresaId,
      valorPrincipal: new Decimal(valorPrincipal),
      multiploCap: new Decimal(faker.number.int({ min: 2.0, max: 4.5 })),
      percentualMrr: faker.number.int({ min: 5, max: 20 }),
      valorTotalDevido: new Decimal(valorPrincipal * faker.number.int({ min: 200, max: 450 }) / 100),
      dataInicio: faker.date.past({ years: 1 }),
      dataFimPrevista: faker.date.future({ years: 2 }),
      statusContrato: faker.helpers.arrayElement(['ATIVO', 'QUITADO', 'INADIMPLENTE']),
      valorTotalPago: new Decimal(valorPrincipal * faker.number.int({ min: 50, max: 200 }) / 100),
      percentualPago: faker.number.int({ min: 25, max: 90 }),
      multiploAtingido: new Decimal(faker.number.int({ min: 1.0, max: 3.0 })),
    })
  }

  const contratoChunks = chunkArray(contratosData, BATCH_SIZE)
  let totalCreated = 0
  for (const chunk of contratoChunks) {
    await prisma.contrato.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.contratos} contratos`)
  }

  const contratos = await prisma.contrato.findMany({ select: { id: true } })

  // Criar pagamentos para cada contrato
  const pagamentosData = []
  for (const contrato of contratos) {
    const numPagamentos = faker.number.int({ min: 6, max: 15 })
    
    for (let i = 0; i < numPagamentos; i++) {
      const valorEsperado = faker.number.int({ min: 5000, max: 50000 })
      
      pagamentosData.push({
        contratoId: contrato.id,
        tipoPagamento: faker.helpers.arrayElement(['MENSAL', 'TRIMESTRAL', 'EXTRAORDINARIO']),
        dataVencimento: faker.date.past({ years: 1 }),
        dataPagamento: faker.datatype.boolean() ? faker.date.recent({ days: 30 }) : null,
        status: faker.helpers.arrayElement(['PAGO', 'PENDENTE', 'ATRASADO']),
        diasAtraso: faker.number.int({ min: 0, max: 30 }),
        mrrPeriodo: new Decimal(faker.number.int({ min: 10000, max: 100000 })),
        valorEsperado: new Decimal(valorEsperado),
        valorPago: new Decimal(valorEsperado * faker.number.int({ min: 95, max: 105 }) / 100),
        valorAcumuladoPago: new Decimal(faker.number.int({ min: 50000, max: 500000 })),
        multiploAtingido: new Decimal(faker.number.int({ min: 1.0, max: 3.0 })),
        taxaEfetiva: faker.number.int({ min: 5, max: 25 }),
        metodoPagamento: faker.helpers.arrayElement(['PIX', 'TED', 'BOLETO']),
      })
    }
  }

  const pagamentoChunks = chunkArray(pagamentosData, BATCH_SIZE)
  totalCreated = 0
  for (const chunk of pagamentoChunks) {
    await prisma.pagamento.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${pagamentosData.length} pagamentos`)
  }

  return { contratos, pagamentos: await prisma.pagamento.findMany({ select: { id: true } }) }
}

async function seedRepassesELogs(
  investimentos: Array<{id: string}>,
  pagamentos: Array<{id: string}>,
  investidores: Array<{id: string}>
) {
  console.log('💸 Criando repasses e logs...')
  
  // Criar repasses
  const repassesData = []
  for (let i = 0; i < TARGET_COUNTS.repasses; i++) {
    const investimento = faker.helpers.arrayElement(investimentos)
    const pagamento = faker.helpers.arrayElement(pagamentos)
    const investidor = faker.helpers.arrayElement(investidores)
    const valorRepasse = faker.number.int({ min: 1000, max: 25000 })
    
    repassesData.push({
      pagamentoId: pagamento.id,
      investimentoId: investimento.id,
      investidorId: investidor.id, // Usar ID real do investidor
      valorRepasse: new Decimal(valorRepasse),
      principalDevolvido: new Decimal(valorRepasse * faker.number.int({ min: 60, max: 90 }) / 100),
      retornoBruto: new Decimal(valorRepasse * faker.number.int({ min: 10, max: 40 }) / 100),
      status: faker.helpers.arrayElement(['EXECUTADO', 'PENDENTE', 'FALHOU']),
      dataExecucao: faker.date.past({ years: 1 }),
      connectedAccountId: faker.datatype.boolean() ? faker.string.alphanumeric(20) : null,
    })
  }

  const repasseChunks = chunkArray(repassesData, BATCH_SIZE)
  let totalCreated = 0
  for (const chunk of repasseChunks) {
    await prisma.repasse.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.repasses} repasses`)
  }

  const repasses = await prisma.repasse.findMany({ select: { id: true } })

  // Criar logs de repasse
  const logsData = []
  for (let i = 0; i < TARGET_COUNTS.repasse_logs; i++) {
    const repasse = faker.helpers.arrayElement(repasses)
    
    logsData.push({
      repasseId: repasse.id,
      connectedAccountId: faker.string.alphanumeric(20),
      smartContractId: faker.string.alphanumeric(15),
      stripePaymentIntentId: `pi_${faker.string.alphanumeric(20)}`,
      stripeTransferId: faker.datatype.boolean() ? `tr_${faker.string.alphanumeric(20)}` : null,
      smartContractTxHash: faker.string.hexadecimal({ length: 66 }),
      status: faker.helpers.arrayElement(['COMPLETED', 'PROCESSING', 'FAILED']),
      amount: new Decimal(faker.number.int({ min: 1000, max: 50000 })),
      currency: 'BRL',
      paymentMethod: faker.helpers.arrayElement(['destination_charge', 'transfer']),
      processedAt: faker.datatype.boolean() ? faker.date.recent({ days: 7 }) : null,
      confirmedAt: faker.datatype.boolean() ? faker.date.recent({ days: 5 }) : null,
      metadata: {
        batch_id: faker.string.uuid(),
        retry_count: faker.number.int({ min: 0, max: 3 }),
        gas_price: faker.string.numeric(8),
      },
    })
  }

  const logChunks = chunkArray(logsData, BATCH_SIZE)
  totalCreated = 0
  for (const chunk of logChunks) {
    await prisma.repasseLog.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.repasse_logs} logs de repasse`)
  }
}

async function seedWalletsETransacoes(investidores: Array<{id: string}>) {
  console.log('💰 Criando carteiras e transações...')
  
  // Criar wallets
  const walletsData = []
  for (let i = 0; i < TARGET_COUNTS.wallets; i++) {
    const investidor = faker.helpers.arrayElement(investidores)
    const saldoAtual = faker.number.int({ min: 0, max: 100000 })
    
    walletsData.push({
      uidUsuario: investidor.id,
      wallet: faker.string.hexadecimal({ length: 42 }),
      saldoAtual: new Decimal(saldoAtual),
      disponivelSaque: new Decimal(saldoAtual * faker.number.int({ min: 70, max: 100 }) / 100),
      valorBloqueado: new Decimal(saldoAtual * faker.number.int({ min: 0, max: 30 }) / 100),
    })
  }

  const walletChunks = chunkArray(walletsData, BATCH_SIZE)
  let totalCreated = 0
  for (const chunk of walletChunks) {
    await prisma.wallet.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.wallets} carteiras`)
  }

  const wallets = await prisma.wallet.findMany({ select: { id: true, uidUsuario: true } })

  // Criar transações de carteira
  const transacoesData = []
  for (let i = 0; i < TARGET_COUNTS.wallet_transactions; i++) {
    const wallet = faker.helpers.arrayElement(wallets)
    
    transacoesData.push({
      carteiraId: wallet.id,
      uidUsuario: wallet.uidUsuario,
      tipo: faker.helpers.arrayElement(['DEPOSITO', 'SAQUE', 'REPASSE', 'TAXA']),
      valor: new Decimal(faker.number.int({ min: 100, max: 10000 })),
      saldoAnterior: new Decimal(faker.number.int({ min: 0, max: 50000 })),
      saldoPosterior: new Decimal(faker.number.int({ min: 0, max: 50000 })),
      descricao: faker.lorem.sentence(),
      referencia: faker.string.uuid(),
      status: faker.helpers.arrayElement(['COMPLETED', 'PENDING', 'FAILED']),
      processadoEm: faker.datatype.boolean() ? faker.date.past({ days: 30 }) : null,
    })
  }

  const transacaoChunks = chunkArray(transacoesData, BATCH_SIZE)
  totalCreated = 0
  for (const chunk of transacaoChunks) {
    await prisma.walletTransaction.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.wallet_transactions} transações`)
  }
}

async function seedStripeConnectedAccounts(empresas: Array<{id: string, tomadorId: string}>) {
  console.log('💳 Criando contas Stripe Connect...')
  
  const accountsData = []
  const selectedEmpresas = faker.helpers.arrayElements(empresas, TARGET_COUNTS.stripe_connected_accounts)
  
  for (const empresa of selectedEmpresas) {
    accountsData.push({
      userId: empresa.tomadorId,
      userType: 'TOMADOR',
      stripeUserId: `acct_${faker.string.alphanumeric(16)}`,
      accessToken: faker.string.alphanumeric(64),
      refreshToken: faker.string.alphanumeric(64),
      scope: faker.helpers.arrayElement(['read_only', 'read_write']),
      chargesEnabled: faker.datatype.boolean(),
      transfersEnabled: faker.datatype.boolean(),
      connectedAt: faker.date.past({ years: 1 }),
      lastSyncAt: faker.date.recent({ days: 7 }),
    })
  }

  const chunks = chunkArray(accountsData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.connectedAccount.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criadas ${totalCreated}/${TARGET_COUNTS.stripe_connected_accounts} contas Stripe`)
  }
}

async function seedSmartContracts(empresas: Array<{id: string, tomadorId: string}>) {
  console.log('📄 Criando smart contracts...')
  
  const contractsData = []
  const selectedEmpresas = faker.helpers.arrayElements(empresas, TARGET_COUNTS.smart_contracts)
  
  for (const empresa of selectedEmpresas) {
    contractsData.push({
      contractAddress: faker.string.hexadecimal({ length: 42 }),
      networkId: faker.helpers.arrayElement([1, 11155111, 137, 80001]), // Ethereum, Sepolia, Polygon, Mumbai
      deployTxHash: faker.string.hexadecimal({ length: 66 }),
      tomadorId: empresa.tomadorId,
      totalAmount: new Decimal(faker.number.int({ min: 100000, max: 5000000 })),
      isActive: faker.datatype.boolean(),
    })
  }

  const chunks = chunkArray(contractsData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.smartContract.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${TARGET_COUNTS.smart_contracts} smart contracts`)
  }
}

async function seedHistoricoFinanceiro(empresas: Array<{id: string}>) {
  console.log('📊 Criando histórico financeiro (12 meses por empresa)...')
  
  const historicoData = []
  
  for (const empresa of empresas) {
    for (let mes = 0; mes < 12; mes++) {
      const dataRef = new Date()
      dataRef.setMonth(dataRef.getMonth() - mes)
      
      const ativoTotal = faker.number.int({ min: 500000, max: 10000000 })
      const passivoTotal = ativoTotal * faker.number.int({ min: 40, max: 80 }) / 100
      
      historicoData.push({
        empresaId: empresa.id,
        periodo: dataRef,
        tipoRelatorio: faker.helpers.arrayElement(['MENSAL', 'TRIMESTRAL', 'ANUAL']),
        ativoTotal: new Decimal(ativoTotal),
        passivoTotal: new Decimal(passivoTotal),
        patrimonioLiquido: new Decimal(ativoTotal - passivoTotal),
        receitaLiquida: new Decimal(faker.number.int({ min: 50000, max: 500000 })),
        custoAquisicaoCliente: new Decimal(faker.number.int({ min: 100, max: 2000 })),
        obrigacoesDivida: faker.number.int({ min: 10000, max: 1000000 }).toString(),
        valorTotalDividas: new Decimal(faker.number.int({ min: 50000, max: 2000000 })),
        fonteDados: faker.helpers.arrayElement(['MANUAL', 'AUTOMATICO', 'CONTABILIDADE']),
        verificadoPor: faker.person.fullName(),
      })
    }
  }

  const chunks = chunkArray(historicoData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.historicoFinanceiro.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${historicoData.length} registros históricos`)
  }
}

async function seedTopClientes(empresas: Array<{id: string}>) {
  console.log('🏆 Criando top clientes (30 por empresa)...')
  
  const clientesData = []
  
  for (const empresa of empresas) {
    for (let i = 0; i < 30; i++) {
      const dataRef = new Date()
      dataRef.setMonth(dataRef.getMonth() - faker.number.int({ min: 0, max: 12 }))
      
      clientesData.push({
        empresaId: empresa.id,
        mesReferencia: dataRef,
        clienteNome: faker.company.name(),
        clienteEmoji: faker.helpers.arrayElement(['🏢', '🏪', '🏭', '🏛️', '🏬', '🏦', '🏨', '🏘️']),
        mrrCliente: new Decimal(faker.number.int({ min: 500, max: 20000 })),
        percentualMrrTotal: new Decimal(faker.number.int({ min: 1, max: 15 })),
      })
    }
  }

  const chunks = chunkArray(clientesData, BATCH_SIZE)
  let totalCreated = 0
  
  for (const chunk of chunks) {
    await prisma.topClientes.createMany({ data: chunk })
    totalCreated += chunk.length
    console.log(`   📊 Criados ${totalCreated}/${clientesData.length} top clientes`)
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando seed massivo do banco de dados...')
    console.log(`📋 Meta: ~${Object.values(TARGET_COUNTS).reduce((a, b) => a + b, 0)} registros total`)
    
    await clearDatabase()
    
    // Criar dados base
    const investidores = await seedInvestidores()
    const empresas = await seedTomadoresEEmpresas()
    
    // Criar métricas
    await seedMetricasMensais(empresas)
    await seedMetricasTempoReal(empresas)
    
    // Criar propostas e investimentos
    const { propostas, investimentos } = await seedPropostasInvestimentos(empresas, investidores)
    
    // Criar contratos e pagamentos
    const { contratos, pagamentos } = await seedContratosEPagamentos(propostas)
    
    // Criar repasses
    await seedRepassesELogs(investimentos, pagamentos, investidores)
    
    // Criar wallets e transações
    await seedWalletsETransacoes(investidores)
    
    // Criar integrações
    await seedStripeConnectedAccounts(empresas)
    await seedSmartContracts(empresas)
    
    // Criar dados históricos
    await seedHistoricoFinanceiro(empresas)
    await seedTopClientes(empresas)
    
    console.log('✅ Seed massivo concluído com sucesso!')
    console.log('📊 Resumo final:')
    console.log(`   • ${TARGET_COUNTS.investidores} investidores`)
    console.log(`   • ${TARGET_COUNTS.empresas} empresas/tomadores`)
    console.log(`   • ${TARGET_COUNTS.propostas} propostas`)
    console.log(`   • ${TARGET_COUNTS.contratos} contratos`)
    console.log(`   • ${TARGET_COUNTS.investimentos} investimentos`)
    console.log(`   • ${empresas.length * 24} métricas mensais`)
    console.log(`   • ${TARGET_COUNTS.metricas_tempo_real} métricas tempo real`)
    console.log(`   • ~${TARGET_COUNTS.contratos * 10} pagamentos`)
    console.log(`   • ${TARGET_COUNTS.repasses} repasses`)
    console.log(`   • ${TARGET_COUNTS.repasse_logs} logs de repasse`)
    console.log(`   • ${TARGET_COUNTS.wallets} carteiras`)
    console.log(`   • ${TARGET_COUNTS.wallet_transactions} transações`)
    console.log(`   • ${TARGET_COUNTS.stripe_connected_accounts} contas Stripe`)
    console.log(`   • ${TARGET_COUNTS.smart_contracts} smart contracts`)
    console.log(`   • ${empresas.length * 12} registros históricos`)
    console.log(`   • ${empresas.length * 30} top clientes`)
    
  } catch (error) {
    console.error('❌ Erro durante o seed massivo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}