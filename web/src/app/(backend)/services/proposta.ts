import { PrismaClient, Proposta, Prisma } from '@/generated/prisma'
import { CreatePropostaData, UpdatePropostaData, PropostaQuery, MarketplaceQuery } from '../schemas/proposta'

const prisma = new PrismaClient()

export class PropostaService {
  // Buscar todas as propostas para marketplace com informações necessárias
  async findForMarketplace(query: MarketplaceQuery): Promise<any[]> {
    const {
      statusFunding,
      valorSolicitadoMin,
      valorSolicitadoMax,
      progressoFundingMin,
      progressoFundingMax,
      scoreMin,
      scoreMax,
      tier,
      segmento,
      setor,
      search,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.PropostaWhereInput = {}

    // Filtros apenas para propostas ativas/abertas no marketplace
    if (statusFunding) {
      where.statusFunding = {
        contains: statusFunding,
        mode: 'insensitive'
      }
    } else {
      where.statusFunding = {
        in: ['ABERTA', 'ATIVA', 'EM_ANDAMENTO']
      }
    }

    // Filtros por faixa de valor solicitado
    if (valorSolicitadoMin || valorSolicitadoMax) {
      where.valorSolicitado = {}
      if (valorSolicitadoMin) {
        where.valorSolicitado.gte = valorSolicitadoMin
      }
      if (valorSolicitadoMax) {
        where.valorSolicitado.lte = valorSolicitadoMax
      }
    }

    // Filtros por faixa de progresso de funding
    if (progressoFundingMin || progressoFundingMax) {
      where.progressoFunding = {}
      if (progressoFundingMin) {
        where.progressoFunding.gte = progressoFundingMin
      }
      if (progressoFundingMax) {
        where.progressoFunding.lte = progressoFundingMax
      }
    }

    // Filtros por empresa
    const empresaFilters: any = {}

    if (segmento) {
      empresaFilters.segmento = {
        contains: segmento,
        mode: 'insensitive'
      }
    }

    if (setor) {
      empresaFilters.setor = {
        contains: setor,
        mode: 'insensitive'
      }
    }

    if (search) {
      empresaFilters.OR = [
        {
          razaoSocial: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          nomeFantasia: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Filtros por score
    if (scoreMin || scoreMax || tier) {
      empresaFilters.scores = {
        some: {
          ...(scoreMin && { scoreTotal: { gte: scoreMin } }),
          ...(scoreMax && { scoreTotal: { lte: scoreMax } }),
          ...(tier && { tier: { contains: tier, mode: 'insensitive' } })
        }
      }
    }

    if (Object.keys(empresaFilters).length > 0) {
      where.empresa = empresaFilters
    }

    const propostas = await prisma.proposta.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            emoji: true,
            segmento: true,
            setor: true,
            scores: {
              orderBy: {
                criadoEm: 'desc'
              },
              take: 1,
              select: {
                scoreTotal: true,
                tier: true
              }
            }
          }
        }
      },
    })

    // Transformar dados para o formato esperado pelo marketplace
    return propostas.map(proposta => {
      const score = proposta.empresa.scores[0]
      const progressoPercentual = Number(proposta.valorSolicitado) > 0
        ? (Number(proposta.valorFinanciado) / Number(proposta.valorSolicitado)) * 100
        : 0

      return {
        id: proposta.id,
        nome: proposta.empresa.nomeFantasia || proposta.empresa.razaoSocial,
        emoji: proposta.empresa.emoji || '🏢',
        score: score?.scoreTotal || 0,
        scoreLabel: score?.tier || 'N/A',
        valor: Number(proposta.valorSolicitado),
        valorSolicitado: Number(proposta.valorSolicitado),
        valorFinanciado: Number(proposta.valorFinanciado),
        rendimento: Number(proposta.multiploCap) * 100 - 100, // Convertendo múltiplo para rendimento %
        prazo: proposta.duracaoMeses,
        progressoFunding: Math.round(progressoPercentual * 100) / 100,
        statusFunding: proposta.statusFunding,
        scoreNaAbertura: proposta.scoreNaAbertura,
        empresa: {
          id: proposta.empresa.id,
          razaoSocial: proposta.empresa.razaoSocial,
          nomeFantasia: proposta.empresa.nomeFantasia,
          segmento: proposta.empresa.segmento,
          setor: proposta.empresa.setor
        }
      }
    })
  }

  // Buscar todas as propostas com filtros e paginação
  async findMany(query: PropostaQuery): Promise<Proposta[]> {
    const {
      empresaId,
      statusFunding,
      valorSolicitadoMin,
      valorSolicitadoMax,
      valorFinanciadoMin,
      valorFinanciadoMax,
      progressoFundingMin,
      progressoFundingMax,
      dataAberturaInicio,
      dataAberturaFim,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.PropostaWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (statusFunding) {
      where.statusFunding = {
        contains: statusFunding,
        mode: 'insensitive'
      }
    }

    // Filtros por faixa de valor solicitado
    if (valorSolicitadoMin || valorSolicitadoMax) {
      where.valorSolicitado = {}
      if (valorSolicitadoMin) {
        where.valorSolicitado.gte = valorSolicitadoMin
      }
      if (valorSolicitadoMax) {
        where.valorSolicitado.lte = valorSolicitadoMax
      }
    }

    // Filtros por faixa de valor financiado
    if (valorFinanciadoMin || valorFinanciadoMax) {
      where.valorFinanciado = {}
      if (valorFinanciadoMin) {
        where.valorFinanciado.gte = valorFinanciadoMin
      }
      if (valorFinanciadoMax) {
        where.valorFinanciado.lte = valorFinanciadoMax
      }
    }

    // Filtros por faixa de progresso de funding
    if (progressoFundingMin || progressoFundingMax) {
      where.progressoFunding = {}
      if (progressoFundingMin) {
        where.progressoFunding.gte = progressoFundingMin
      }
      if (progressoFundingMax) {
        where.progressoFunding.lte = progressoFundingMax
      }
    }

    // Filtros por faixa de data de abertura
    if (dataAberturaInicio || dataAberturaFim) {
      where.dataAbertura = {}
      if (dataAberturaInicio) {
        where.dataAbertura.gte = dataAberturaInicio
      }
      if (dataAberturaFim) {
        where.dataAbertura.lte = dataAberturaFim
      }
    }

    return await prisma.proposta.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        },
        contrato: {
          select: {
            id: true,
            statusContrato: true,
            valorPrincipal: true,
            dataInicio: true,
          }
        },
        investimentos: {
          select: {
            id: true,
            valorAportado: true,
            statusInvestimento: true,
            investidor: {
              select: {
                id: true,
                nomeRazaoSocial: true,
              }
            }
          }
        },
      },
    })
  }

  // Buscar proposta por ID
  async findById(id: string): Promise<Proposta | null> {
    return await prisma.proposta.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            segmento: true,
            setor: true,
          }
        },
        contrato: {
          select: {
            id: true,
            statusContrato: true,
            valorPrincipal: true,
            valorTotalDevido: true,
            dataInicio: true,
            dataFimPrevista: true,
          }
        },
        investimentos: {
          select: {
            id: true,
            valorAportado: true,
            statusInvestimento: true,
            dataInvestimento: true,
            investidor: {
              select: {
                id: true,
                nomeRazaoSocial: true,
                tipoPessoa: true,
              }
            }
          }
        },
      },
    })
  }

  // Criar nova proposta
  async create(data: CreatePropostaData): Promise<Proposta> {
    // Verificar se a empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: data.empresaId }
    })
    
    if (!empresa) {
      throw new Error('Empresa não encontrada')
    }

    return await prisma.proposta.create({
      data,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        },
        contrato: {
          select: {
            id: true,
            statusContrato: true,
            valorPrincipal: true,
            dataInicio: true,
          }
        },
        investimentos: {
          select: {
            id: true,
            valorAportado: true,
            statusInvestimento: true,
          }
        },
      },
    })
  }

  // Atualizar proposta
  async update(id: string, data: UpdatePropostaData): Promise<Proposta> {
    // Verificar se a proposta existe
    const existingProposta = await prisma.proposta.findUnique({
      where: { id }
    })
    
    if (!existingProposta) {
      throw new Error('Proposta não encontrada')
    }

    return await prisma.proposta.update({
      where: { id },
      data,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        },
        contrato: {
          select: {
            id: true,
            statusContrato: true,
            valorPrincipal: true,
            dataInicio: true,
          }
        },
        investimentos: {
          select: {
            id: true,
            valorAportado: true,
            statusInvestimento: true,
          }
        },
      },
    })
  }

  // Deletar proposta
  async delete(id: string): Promise<Proposta> {
    // Verificar se a proposta existe
    const existingProposta = await prisma.proposta.findUnique({
      where: { id }
    })
    
    if (!existingProposta) {
      throw new Error('Proposta não encontrada')
    }

    return await prisma.proposta.delete({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        },
        contrato: {
          select: {
            id: true,
            statusContrato: true,
            valorPrincipal: true,
            dataInicio: true,
          }
        },
        investimentos: {
          select: {
            id: true,
            valorAportado: true,
            statusInvestimento: true,
          }
        },
      },
    })
  }

  // Contar total de propostas (para paginação)
  async count(query: Partial<PropostaQuery>): Promise<number> {
    const { 
      empresaId, 
      statusFunding, 
      valorSolicitadoMin, 
      valorSolicitadoMax,
      valorFinanciadoMin,
      valorFinanciadoMax,
      progressoFundingMin,
      progressoFundingMax,
      dataAberturaInicio, 
      dataAberturaFim 
    } = query

    const where: Prisma.PropostaWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (statusFunding) {
      where.statusFunding = {
        contains: statusFunding,
        mode: 'insensitive'
      }
    }

    if (valorSolicitadoMin || valorSolicitadoMax) {
      where.valorSolicitado = {}
      if (valorSolicitadoMin) {
        where.valorSolicitado.gte = valorSolicitadoMin
      }
      if (valorSolicitadoMax) {
        where.valorSolicitado.lte = valorSolicitadoMax
      }
    }

    if (valorFinanciadoMin || valorFinanciadoMax) {
      where.valorFinanciado = {}
      if (valorFinanciadoMin) {
        where.valorFinanciado.gte = valorFinanciadoMin
      }
      if (valorFinanciadoMax) {
        where.valorFinanciado.lte = valorFinanciadoMax
      }
    }

    if (progressoFundingMin || progressoFundingMax) {
      where.progressoFunding = {}
      if (progressoFundingMin) {
        where.progressoFunding.gte = progressoFundingMin
      }
      if (progressoFundingMax) {
        where.progressoFunding.lte = progressoFundingMax
      }
    }

    if (dataAberturaInicio || dataAberturaFim) {
      where.dataAbertura = {}
      if (dataAberturaInicio) {
        where.dataAbertura.gte = dataAberturaInicio
      }
      if (dataAberturaFim) {
        where.dataAbertura.lte = dataAberturaFim
      }
    }

    return await prisma.proposta.count({ where })
  }

  // Buscar propostas por empresa
  async findByEmpresa(empresaId: string, limit: number = 10): Promise<Proposta[]> {
    return await prisma.proposta.findMany({
      where: { empresaId },
      orderBy: { criadoEm: 'desc' },
      take: limit,
    })
  }

  // Buscar propostas por status
  async findByStatus(statusFunding: string, limit: number = 50): Promise<Proposta[]> {
    return await prisma.proposta.findMany({
      where: {
        statusFunding: {
          contains: statusFunding,
          mode: 'insensitive'
        }
      },
      orderBy: { criadoEm: 'desc' },
      take: limit,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
      },
    })
  }

  // Buscar propostas ativas (abertas)
  async findActive(limit: number = 50): Promise<Proposta[]> {
    return await prisma.proposta.findMany({
      where: {
        statusFunding: {
          in: ['ABERTA', 'ATIVA', 'EM_ANDAMENTO']
        }
      },
      orderBy: { dataAbertura: 'desc' },
      take: limit,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
      },
    })
  }

  // Buscar propostas com funding alto
  async findHighFunding(minProgress: number = 80, limit: number = 50): Promise<Proposta[]> {
    return await prisma.proposta.findMany({
      where: {
        progressoFunding: {
          gte: minProgress
        }
      },
      orderBy: { progressoFunding: 'desc' },
      take: limit,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
      },
    })
  }

  // Calcular estatísticas de propostas
  async getStats(empresaId?: string): Promise<{
    total: number
    porStatus: Record<string, number>
    valorTotalSolicitado: number
    valorTotalFinanciado: number
    progressoMedio: number
  }> {
    const where: Prisma.PropostaWhereInput = empresaId ? { empresaId } : {}

    const propostas = await prisma.proposta.findMany({
      where,
      select: {
        statusFunding: true,
        valorSolicitado: true,
        valorFinanciado: true,
        progressoFunding: true,
      }
    })

    const stats = {
      total: propostas.length,
      porStatus: {} as Record<string, number>,
      valorTotalSolicitado: 0,
      valorTotalFinanciado: 0,
      progressoMedio: 0,
    }

    let progressoTotal = 0

    for (const proposta of propostas) {
      // Contar por status
      stats.porStatus[proposta.statusFunding] = (stats.porStatus[proposta.statusFunding] || 0) + 1
      
      // Somar valores
      stats.valorTotalSolicitado += Number(proposta.valorSolicitado)
      stats.valorTotalFinanciado += Number(proposta.valorFinanciado)
      progressoTotal += Number(proposta.progressoFunding)
    }

    // Calcular progresso médio
    stats.progressoMedio = propostas.length > 0 ? progressoTotal / propostas.length : 0

    return stats
  }
}

export const propostaService = new PropostaService()