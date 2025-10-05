import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Configurar faker para Brasil
faker.locale = 'pt_BR';

// Helper para gerar CNPJ válido
function generateCNPJ(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  const cnpj = Array(12).fill(0).map(() => randomDigits());
  
  // Calcular dígitos verificadores (simplificado)
  const d1 = cnpj.reduce((acc, digit, index) => {
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    return acc + digit * weights[index];
  }, 0) % 11;
  
  const d2 = [...cnpj, d1 < 2 ? 0 : 11 - d1].reduce((acc, digit, index) => {
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    return acc + digit * weights[index];
  }, 0) % 11;

  cnpj.push(d1 < 2 ? 0 : 11 - d1);
  cnpj.push(d2 < 2 ? 0 : 11 - d2);
  
  return cnpj.join('').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Helper para gerar CPF válido
function generateCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  const cpf = Array(9).fill(0).map(() => randomDigits());
  
  // Calcular dígitos verificadores (simplificado)
  const d1 = cpf.reduce((acc, digit, index) => acc + digit * (10 - index), 0) % 11;
  const d2 = [...cpf, d1 < 2 ? 0 : 11 - d1].reduce((acc, digit, index) => acc + digit * (11 - index), 0) % 11;
  
  cpf.push(d1 < 2 ? 0 : 11 - d1);
  cpf.push(d2 < 2 ? 0 : 11 - d2);
  
  return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Dados mockados realistas
const EMPRESAS_MOCK = [
  {
    razaoSocial: 'TechFlow Soluções Ltda',
    nomeFantasia: 'TechFlow',
    segmento: 'SaaS',
    setor: 'Tecnologia',
    produto: 'Plataforma de automação de processos',
    emoji: '🚀',
    website: 'techflow.com.br'
  },
  {
    razaoSocial: 'GreenPay Pagamentos S.A.',
    nomeFantasia: 'GreenPay',
    segmento: 'Fintech',
    setor: 'Serviços Financeiros',
    produto: 'Gateway de pagamentos sustentável',
    emoji: '💳',
    website: 'greenpay.com.br'
  },
  {
    razaoSocial: 'EduLearn Tecnologia Educacional Ltda',
    nomeFantasia: 'EduLearn',
    segmento: 'EdTech',
    setor: 'Educação',
    produto: 'Plataforma de ensino adaptativo',
    emoji: '📚',
    website: 'edulearn.com.br'
  },
  {
    razaoSocial: 'HealthConnect Telemedicina Ltda',
    nomeFantasia: 'HealthConnect',
    segmento: 'HealthTech',
    setor: 'Saúde',
    produto: 'Telemedicina e prontuário eletrônico',
    emoji: '🏥',
    website: 'healthconnect.com.br'
  },
  {
    razaoSocial: 'SmartLog Logística Inteligente S.A.',
    nomeFantasia: 'SmartLog',
    segmento: 'LogTech',
    setor: 'Logística',
    produto: 'Otimização de rotas e frota',
    emoji: '🚛',
    website: 'smartlog.com.br'
  }
];

const INVESTIDORES_MOCK = [
  { nome: 'Carlos Eduardo Silva', tipoPessoa: 'PF', modeloInvestimento: 'CONSERVADOR' },
  { nome: 'Ana Paula Rodrigues', tipoPessoa: 'PF', modeloInvestimento: 'MODERADO' },
  { nome: 'Venture Capital Brasil Ltda', tipoPessoa: 'PJ', modeloInvestimento: 'AGRESSIVO' },
  { nome: 'Roberto Santos Investment', tipoPessoa: 'PF', modeloInvestimento: 'MODERADO' },
  { nome: 'Anjo Investimentos S.A.', tipoPessoa: 'PJ', modeloInvestimento: 'AGRESSIVO' },
  { nome: 'Mariana Costa Participações', tipoPessoa: 'PF', modeloInvestimento: 'CONSERVADOR' },
  { nome: 'Tech Angels Fund', tipoPessoa: 'PJ', modeloInvestimento: 'AGRESSIVO' },
  { nome: 'Patricia Oliveira', tipoPessoa: 'PF', modeloInvestimento: 'MODERADO' }
];

const PLANOS_MOCK = ['Básico', 'Profissional', 'Premium', 'Enterprise', 'Starter'];
const CLIENTES_MOCK = [
  { nome: 'Ambev', emoji: '🍺' },
  { nome: 'Magazine Luiza', emoji: '🛍️' },
  { nome: 'iFood', emoji: '🍕' },
  { nome: 'Natura', emoji: '🌿' },
  { nome: 'Banco do Brasil', emoji: '🏦' },
  { nome: 'Petrobras', emoji: '⛽' },
  { nome: 'Vale', emoji: '⚡' },
  { nome: 'JBS', emoji: '🥩' },
  { nome: 'Embraer', emoji: '✈️' },
  { nome: 'WEG', emoji: '🔧' }
];

async function seedInvestidores() {
  console.log('🔸 Criando investidores...');
  
  const investidores = [];
  for (const investidorData of INVESTIDORES_MOCK) {
    const investidor = await prisma.investidor.create({
      data: {
        uidUsuario: faker.datatype.uuid(),
        tipoPessoa: investidorData.tipoPessoa,
        documentoIdentificacao: investidorData.tipoPessoa === 'PF' ? generateCPF() : generateCNPJ(),
        nomeRazaoSocial: investidorData.nome,
        patrimonioLiquido: new Decimal(faker.datatype.number({ min: 100000, max: 10000000 })),
        declaracaoRisco: faker.datatype.boolean(),
        experienciaAtivosRisco: faker.datatype.boolean(),
        modeloInvestimento: investidorData.modeloInvestimento,
        fonteRecursos: faker.helpers.arrayElement(['Salário', 'Empresa própria', 'Investimentos', 'Herança']),
        statusKyc: faker.helpers.arrayElement(['PENDENTE', 'APROVADO', 'REJEITADO']),
      }
    });
    investidores.push(investidor);
  }
  
  return investidores;
}

async function seedTomadoresEEmpresas() {
  console.log('🔸 Criando tomadores e empresas...');
  
  const empresas = [];
  for (const empresaData of EMPRESAS_MOCK) {
    // Criar tomador
    const tomador = await prisma.tomador.create({
      data: {
        uidUsuario: faker.datatype.uuid(),
        nomeCompleto: faker.name.fullName(),
        email: faker.internet.email(),
        cargo: faker.helpers.arrayElement(['CEO', 'CTO', 'Fundador', 'Cofundador']),
        statusCompliance: faker.helpers.arrayElement(['PENDENTE', 'APROVADO']),
      }
    });

    // Criar empresa
    const empresa = await prisma.empresa.create({
      data: {
        tomadorId: tomador.id,
        cnpj: generateCNPJ(),
        razaoSocial: empresaData.razaoSocial,
        nomeFantasia: empresaData.nomeFantasia,
        website: empresaData.website,
        segmento: empresaData.segmento,
        setor: empresaData.setor,
        estagioInvestimento: faker.helpers.arrayElement(['Pre-seed', 'Seed', 'Serie A', 'Serie B']),
        descricaoCurta: faker.company.catchPhrase(),
        descricaoCompleta: faker.lorem.paragraph(3),
        produto: empresaData.produto,
        dataFundacao: faker.date.past(5),
        numeroFuncionarios: faker.datatype.number({ min: 5, max: 500 }),
        emoji: empresaData.emoji,
      }
    });

    empresas.push({ tomador, empresa });
  }
  
  return empresas;
}

async function seedMetricasEHistorico(empresas: any[]) {
  console.log('🔸 Criando métricas e histórico financeiro...');
  
  for (const { empresa } of empresas) {
    // Métricas mensais dos últimos 24 meses
    for (let i = 24; i >= 0; i--) {
      const mesReferencia = new Date();
      mesReferencia.setMonth(mesReferencia.getMonth() - i);
      mesReferencia.setDate(1);

      const baseMrr = faker.datatype.number({ min: 50000, max: 500000 });
      const growth = 1 + (faker.datatype.number({ min: 0, max: 20 }) / 100); // 0-20% growth
      const mrr = new Decimal(baseMrr * Math.pow(growth, i / 12));

      await prisma.metricasMensais.create({
        data: {
          empresaId: empresa.id,
          mesReferencia,
          mrrFinal: mrr,
          mrrMedio: mrr.mul(0.95),
          arrFinal: mrr.mul(12),
          nrrMensal: new Decimal(faker.datatype.number({ min: 95, max: 115 })),
          numClientesInicio: faker.datatype.number({ min: 100, max: 1000 }),
          numClientesFinal: faker.datatype.number({ min: 100, max: 1000 }),
          novosClientes: faker.datatype.number({ min: 10, max: 100 }),
          clientesCancelados: faker.datatype.number({ min: 5, max: 50 }),
          ticketMedio: mrr.div(faker.datatype.number({ min: 100, max: 1000 })),
          churnRateMedio: new Decimal(faker.datatype.number({ min: 2, max: 8 }) / 100),
          opexMensal: mrr.mul(faker.datatype.number({ min: 60, max: 120 }) / 100),
        }
      });
    }

    // Métricas em tempo real
    const mrrAtual = faker.datatype.number({ min: 50000, max: 500000 });
    await prisma.metricasTempoReal.create({
      data: {
        empresaId: empresa.id,
        mrr: new Decimal(mrrAtual),
        arr: new Decimal(mrrAtual * 12),
        nrr: new Decimal(faker.datatype.number({ min: 95, max: 120 })),
        usuariosAtivos: faker.datatype.number({ min: 1000, max: 10000 }),
        churnRate: new Decimal(faker.datatype.number({ min: 2, max: 8 }) / 100),
        opexMensal: new Decimal(mrrAtual * (faker.datatype.number({ min: 60, max: 120 }) / 100)),
        ltvCacAjustado: new Decimal(faker.datatype.number({ min: 3, max: 10 })),
        dscrAjustado: new Decimal(faker.datatype.number({ min: 1.2, max: 3 })),
      }
    });

    // Top clientes
    for (let i = 0; i < 5; i++) {
      const cliente = faker.helpers.arrayElement(CLIENTES_MOCK);
      await prisma.topClientes.create({
        data: {
          empresaId: empresa.id,
          mesReferencia: new Date(),
          clienteNome: cliente.nome,
          clienteEmoji: cliente.emoji,
          plano: faker.helpers.arrayElement(PLANOS_MOCK),
          mrrCliente: new Decimal(faker.datatype.number({ min: 1000, max: 50000 })),
          percentualMrrTotal: new Decimal(faker.datatype.number({ min: 5, max: 25 })),
        }
      });
    }

    // MRR por plano
    for (const plano of PLANOS_MOCK.slice(0, 3)) {
      await prisma.mrrPorPlano.create({
        data: {
          empresaId: empresa.id,
          mesReferencia: new Date(),
          nomePlano: plano,
          mrrPlano: new Decimal(faker.datatype.number({ min: 10000, max: 200000 })),
          numClientesPlano: faker.datatype.number({ min: 50, max: 500 }),
          percentualTotal: new Decimal(faker.datatype.number({ min: 15, max: 40 })),
        }
      });
    }

    // Cohorts
    for (let i = 12; i >= 0; i--) {
      const cohortMes = new Date();
      cohortMes.setMonth(cohortMes.getMonth() - i);
      cohortMes.setDate(1);

      await prisma.cohorts.create({
        data: {
          empresaId: empresa.id,
          cohortMes,
          clientesIniciais: faker.datatype.number({ min: 50, max: 200 }),
          retencaoM1: new Decimal(faker.datatype.number({ min: 85, max: 95 })),
          retencaoM2: new Decimal(faker.datatype.number({ min: 75, max: 90 })),
          retencaoM3: new Decimal(faker.datatype.number({ min: 70, max: 85 })),
          retencaoM6: new Decimal(faker.datatype.number({ min: 60, max: 80 })),
          retencaoM12: new Decimal(faker.datatype.number({ min: 50, max: 75 })),
          ltvMedio: new Decimal(faker.datatype.number({ min: 1000, max: 10000 })),
        }
      });
    }

    // Score
    const scoreTotal = faker.datatype.number({ min: 300, max: 850 });
    const score = await prisma.score.create({
      data: {
        empresaId: empresa.id,
        scoreTotal,
        tier: scoreTotal >= 750 ? 'A' : scoreTotal >= 650 ? 'B' : scoreTotal >= 500 ? 'C' : 'D',
        variacaoMensal: faker.datatype.number({ min: -50, max: 50 }),
        rankingPercentil: faker.datatype.number({ min: 10, max: 90 }),
        tipoScore: 'GERAL',
        metodo: 'ML_ENHANCED',
      }
    });

    // Score categorias
    const categorias = ['Financeiro', 'Operacional', 'Crescimento', 'Risco'];
    for (const categoria of categorias) {
      await prisma.scoreCategoria.create({
        data: {
          scoreId: score.id,
          categoria,
          scoreCategoria: faker.datatype.number({ min: 50, max: 100 }),
        }
      });
    }

    // Insights
    const insights = [
      'MRR cresceu 15% no último mês',
      'Churn rate está acima da média do setor',
      'CAC Payback melhorou significativamente',
      'Expansão de receita superou expectativas'
    ];

    for (const insight of insights) {
      await prisma.insight.create({
        data: {
          empresaId: empresa.id,
          tipo: faker.helpers.arrayElement(['POSITIVO', 'NEGATIVO', 'NEUTRO']),
          categoria: faker.helpers.arrayElement(['MRR', 'CHURN', 'CAC', 'GROWTH']),
          titulo: insight,
          descricao: faker.lorem.sentence(),
        }
      });
    }
  }
}

async function seedPropostasEInvestimentos(empresas: any[], investidores: any[]) {
  console.log('🔸 Criando propostas e investimentos...');
  
  for (const { empresa } of empresas.slice(0, 3)) { // Apenas 3 empresas com propostas ativas
    const valorSolicitado = faker.datatype.number({ min: 500000, max: 5000000 });
    
    const proposta = await prisma.proposta.create({
      data: {
        empresaId: empresa.id,
        valorSolicitado: new Decimal(valorSolicitado),
        multiploCap: new Decimal(faker.datatype.number({ min: 120, max: 300 }) / 100),
        percentualMrr: new Decimal(faker.datatype.number({ min: 8, max: 25 })),
        duracaoMeses: faker.datatype.number({ min: 12, max: 36 }),
        valorMinimoFunding: new Decimal(valorSolicitado * 0.3),
        planoUsoFundos: 'Expansão da equipe de vendas e marketing',
        statusFunding: faker.helpers.arrayElement(['ATIVA', 'FINANCIADA', 'FECHADA']),
        valorFinanciado: new Decimal(faker.datatype.number({ min: valorSolicitado * 0.5, max: valorSolicitado })),
        progressoFunding: new Decimal(faker.datatype.number({ min: 30, max: 100 })),
        dataAbertura: faker.date.past(2),
        scoreNaAbertura: faker.datatype.number({ min: 650, max: 800 }),
      }
    });

    // Criar investimentos para a proposta
    const numInvestidores = faker.datatype.number({ min: 2, max: 5 });
    const investidoresSelecionados = faker.helpers.shuffle(investidores).slice(0, numInvestidores);
    
    for (const investidor of investidoresSelecionados) {
      const valorAportado = faker.datatype.number({ min: 50000, max: 1000000 });
      
      await prisma.investimento.create({
        data: {
          propostaId: proposta.id,
          investidorId: investidor.id,
          valorAportado: new Decimal(valorAportado),
          percentualParticipacao: new Decimal(valorAportado / valorSolicitado * 100),
          statusInvestimento: faker.helpers.arrayElement(['CONFIRMADO', 'PENDENTE']),
          valorTotalRecebido: new Decimal(faker.datatype.number({ min: 0, max: valorAportado * 1.5 })),
          tirRealizado: new Decimal(faker.datatype.number({ min: 8, max: 35 })),
        }
      });
    }
  }
}

async function seedContratosEPagamentos(empresas: any[], investidores: any[]) {
  console.log('🔸 Criando contratos e sistema de pagamentos...');
  
  // Pegar propostas financiadas
  const propostas = await prisma.proposta.findMany({
    where: { statusFunding: 'FINANCIADA' },
    include: { investimentos: true }
  });

  for (const proposta of propostas) {
    const contrato = await prisma.contrato.create({
      data: {
        propostaId: proposta.id,
        empresaId: proposta.empresaId,
        valorPrincipal: proposta.valorFinanciado,
        multiploCap: proposta.multiploCap,
        percentualMrr: proposta.percentualMrr,
        valorTotalDevido: proposta.valorFinanciado.mul(proposta.multiploCap),
        dataInicio: new Date(),
        dataFimPrevista: new Date(Date.now() + proposta.duracaoMeses * 30 * 24 * 60 * 60 * 1000),
        statusContrato: 'ATIVO',
        valorTotalPago: new Decimal(faker.datatype.number({ min: 0, max: Number(proposta.valorFinanciado) * 0.3 })),
        percentualPago: new Decimal(faker.datatype.number({ min: 0, max: 30 })),
        multiploAtingido: new Decimal(faker.datatype.number({ min: 100, max: 130 }) / 100),
      }
    });

    // Criar pagamentos mensais
    for (let i = 0; i < 12; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);
      
      const isPago = i < faker.datatype.number({ min: 0, max: 6 });
      
      const pagamento = await prisma.pagamento.create({
        data: {
          contratoId: contrato.id,
          tipoPagamento: 'MENSAL',
          dataVencimento,
          dataPagamento: isPago ? new Date(dataVencimento.getTime() + faker.datatype.number({ min: 0, max: 5 }) * 24 * 60 * 60 * 1000) : null,
          diasAtraso: isPago ? faker.datatype.number({ min: 0, max: 3 }) : 0,
          mrrPeriodo: new Decimal(faker.datatype.number({ min: 80000, max: 200000 })),
          valorEsperado: new Decimal(faker.datatype.number({ min: 15000, max: 50000 })),
          valorPago: isPago ? new Decimal(faker.datatype.number({ min: 15000, max: 50000 })) : null,
          status: isPago ? 'PAGO' : i === 0 ? 'PENDENTE' : 'AGENDADO',
        }
      });

      // Criar repasses para investidores se o pagamento foi efetuado
      if (isPago) {
        for (const investimento of proposta.investimentos) {
          const valorRepasse = Number(pagamento.valorPago || 0) * (Number(investimento.percentualParticipacao) / 100);
          
          const repasse = await prisma.repasse.create({
            data: {
              pagamentoId: pagamento.id,
              investimentoId: investimento.id,
              investidorId: investimento.investidorId,
              valorRepasse: new Decimal(valorRepasse),
              principalDevolvido: new Decimal(valorRepasse * 0.7),
              retornoBruto: new Decimal(valorRepasse * 0.3),
              status: 'EXECUTADO',
              dataExecucao: pagamento.dataPagamento,
            }
          });

          // Log do repasse
          await prisma.repasseLog.create({
            data: {
              repasseId: repasse.id,
              status: 'COMPLETED',
              amount: new Decimal(valorRepasse),
              currency: 'BRL',
              paymentMethod: 'PIX',
              processedAt: new Date(),
              metadata: {
                automated: true,
                contractId: contrato.id,
                period: dataVencimento.toISOString().slice(0, 7)
              }
            }
          });
        }
      }
    }
  }
}

async function seedWallets() {
  console.log('🔸 Criando carteiras...');
  
  const investidores = await prisma.investidor.findMany();
  
  for (const investidor of investidores) {
    const wallet = await prisma.wallet.create({
      data: {
        uidUsuario: investidor.uidUsuario,
        saldoAtual: new Decimal(faker.datatype.number({ min: 1000, max: 100000 })),
        disponivelSaque: new Decimal(faker.datatype.number({ min: 500, max: 50000 })),
        valorBloqueado: new Decimal(faker.datatype.number({ min: 0, max: 10000 })),
      }
    });

    // Criar algumas transações
    const numTransactions = faker.datatype.number({ min: 5, max: 15 });
    
    for (let i = 0; i < numTransactions; i++) {
      await prisma.walletTransaction.create({
        data: {
          carteiraId: wallet.id,
          uidUsuario: investidor.uidUsuario,
          tipo: faker.helpers.arrayElement(['DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'RETURN', 'PIX_DEPOSIT']),
          valor: new Decimal(faker.datatype.number({ min: 100, max: 10000 })),
          descricao: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(['COMPLETED', 'PENDING', 'FAILED']),
          referencia: faker.datatype.uuid(),
          processadoEm: faker.datatype.boolean() ? faker.date.past(1) : null,
        }
      });
    }
  }
}

async function main() {
  console.log('🚀 Iniciando seed do banco de dados...');
  
  try {
    // Limpar dados existentes (exceto usuários)
    console.log('🧹 Limpando dados existentes...');
    
    await prisma.walletTransaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.repasseLog.deleteMany();
    await prisma.repasse.deleteMany();
    await prisma.pagamento.deleteMany();
    await prisma.contrato.deleteMany();
    await prisma.investimento.deleteMany();
    await prisma.proposta.deleteMany();
    await prisma.insight.deleteMany();
    await prisma.scoreFeature.deleteMany();
    await prisma.scoreRecomendacao.deleteMany();
    await prisma.scoreCategoria.deleteMany();
    await prisma.score.deleteMany();
    await prisma.cohorts.deleteMany();
    await prisma.topClientes.deleteMany();
    await prisma.mrrPorPlano.deleteMany();
    await prisma.evolucaoMetricas.deleteMany();
    await prisma.metricasMensais.deleteMany();
    await prisma.metricasTempoReal.deleteMany();
    await prisma.historicoFinanceiro.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.tomador.deleteMany();
    await prisma.investidor.deleteMany();

    // Criar dados
    const investidores = await seedInvestidores();
    const empresas = await seedTomadoresEEmpresas();
    await seedMetricasEHistorico(empresas);
    await seedPropostasEInvestimentos(empresas, investidores);
    await seedContratosEPagamentos(empresas, investidores);
    await seedWallets();
    
    console.log('✅ Seed concluído com sucesso!');
    console.log(`📊 Dados criados:
    - ${investidores.length} investidores
    - ${empresas.length} empresas/tomadores
    - Métricas mensais e em tempo real
    - Propostas e investimentos
    - Contratos e pagamentos
    - Sistema de repasses
    - Carteiras e transações`);
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

export default main;