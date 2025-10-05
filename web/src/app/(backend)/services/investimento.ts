import { PrismaClient } from '../../../generated/prisma'
import type { 
  CreateInvestimentoInput, 
  UpdateInvestimentoInput, 
  InvestimentoQueryParams 
} from '../schemas/investimento'

const prisma = new PrismaClient()

export class InvestimentoService {
  // Listar investimentos com filtros e paginação
  static async list(params: InvestimentoQueryParams) {
    const {
      page,
      limit,
      investidorId,
      propostaId,
      contratoId,
      statusInvestimento,
      sortBy,
      sortOrder,
    } = params

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (investidorId) {
      where.investidorId = investidorId
    }
    
    if (propostaId) {
      where.propostaId = propostaId
    }
    
    if (contratoId) {
      where.contratoId = contratoId
    }
    
    if (statusInvestimento) {
      where.statusInvestimento = statusInvestimento
    }

    // Construir ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Executar consulta com contagem total
    const [investimentos, total] = await Promise.all([
      prisma.investimento.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          investidor: {
            select: {
              id: true,
              nomeRazaoSocial: true,
              documentoIdentificacao: true,
              tipoPessoa: true,
            },
          },
          proposta: {
            select: {
              id: true,
              valorSolicitado: true,
              statusFunding: true,
            },
          },
          contrato: {
            select: {
              id: true,
              valorPrincipal: true,
              statusContrato: true,
            },
          },
        },
      }),
      prisma.investimento.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: investimentos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }

  // Buscar investimento por ID
  static async findById(id: string) {
    const investimento = await prisma.investimento.findUnique({
      where: { id },
      include: {
        investidor: {
          select: {
            id: true,
            nomeRazaoSocial: true,
            documentoIdentificacao: true,
            tipoPessoa: true,
          },
        },
        proposta: {
          select: {
            id: true,
            valorSolicitado: true,
            statusFunding: true,
          },
        },
        contrato: {
          select: {
            id: true,
            valorPrincipal: true,
            statusContrato: true,
          },
        },
        repasses: {
          select: {
            id: true,
            valorRepasse: true,
            status: true,
            dataExecucao: true,
          },
          orderBy: {
            dataExecucao: 'desc',
          },
        },
      },
    })

    if (!investimento) {
      throw new Error('Investimento não encontrado')
    }

    return investimento
  }

  // Criar novo investimento
  static async create(data: CreateInvestimentoInput) {
    // Verificar se o investidor existe
    const investidor = await prisma.investidor.findUnique({
      where: { id: data.investidorId },
    })

    if (!investidor) {
      throw new Error('Investidor não encontrado')
    }

    // Verificar se a proposta existe (se fornecida)
    if (data.propostaId) {
      const proposta = await prisma.proposta.findUnique({
        where: { id: data.propostaId },
      })

      if (!proposta) {
        throw new Error('Proposta não encontrada')
      }
    }

    // Verificar se o contrato existe (se fornecido)
    if (data.contratoId) {
      const contrato = await prisma.contrato.findUnique({
        where: { id: data.contratoId },
      })

      if (!contrato) {
        throw new Error('Contrato não encontrado')
      }
    }

    const investimento = await prisma.investimento.create({
      data,
      include: {
        investidor: {
          select: {
            id: true,
            nomeRazaoSocial: true,
            documentoIdentificacao: true,
            tipoPessoa: true,
          },
        },
        proposta: {
          select: {
            id: true,
            valorSolicitado: true,
            statusFunding: true,
          },
        },
        contrato: {
          select: {
            id: true,
            valorPrincipal: true,
            statusContrato: true,
          },
        },
      },
    })

    return investimento
  }

  // Atualizar investimento
  static async update(id: string, data: UpdateInvestimentoInput) {
    // Verificar se o investimento existe
    const investimentoExistente = await prisma.investimento.findUnique({
      where: { id },
    })

    if (!investimentoExistente) {
      throw new Error('Investimento não encontrado')
    }

    // Verificar se o investidor existe (se fornecido)
    if (data.investidorId) {
      const investidor = await prisma.investidor.findUnique({
        where: { id: data.investidorId },
      })

      if (!investidor) {
        throw new Error('Investidor não encontrado')
      }
    }

    // Verificar se a proposta existe (se fornecida)
    if (data.propostaId) {
      const proposta = await prisma.proposta.findUnique({
        where: { id: data.propostaId },
      })

      if (!proposta) {
        throw new Error('Proposta não encontrada')
      }
    }

    // Verificar se o contrato existe (se fornecido)
    if (data.contratoId) {
      const contrato = await prisma.contrato.findUnique({
        where: { id: data.contratoId },
      })

      if (!contrato) {
        throw new Error('Contrato não encontrado')
      }
    }

    const investimento = await prisma.investimento.update({
      where: { id },
      data,
      include: {
        investidor: {
          select: {
            id: true,
            nomeRazaoSocial: true,
            documentoIdentificacao: true,
            tipoPessoa: true,
          },
        },
        proposta: {
          select: {
            id: true,
            valorSolicitado: true,
            statusFunding: true,
          },
        },
        contrato: {
          select: {
            id: true,
            valorPrincipal: true,
            statusContrato: true,
          },
        },
      },
    })

    return investimento
  }

  // Deletar investimento
  static async delete(id: string) {
    // Verificar se o investimento existe
    const investimento = await prisma.investimento.findUnique({
      where: { id },
    })

    if (!investimento) {
      throw new Error('Investimento não encontrado')
    }

    await prisma.investimento.delete({
      where: { id },
    })

    return { message: 'Investimento deletado com sucesso' }
  }

  // Estatísticas do investimento
  static async getStats(investidorId?: string) {
    const where = investidorId ? { investidorId } : {}

    const [
      totalInvestimentos,
      valorTotalAportado,
      valorTotalRecebido,
      investimentosPorStatus,
    ] = await Promise.all([
      prisma.investimento.count({ where }),
      prisma.investimento.aggregate({
        where,
        _sum: { valorAportado: true },
      }),
      prisma.investimento.aggregate({
        where,
        _sum: { valorTotalRecebido: true },
      }),
      prisma.investimento.groupBy({
        by: ['statusInvestimento'],
        where,
        _count: { statusInvestimento: true },
        _sum: { valorAportado: true },
      }),
    ])

    return {
      totalInvestimentos,
      valorTotalAportado: valorTotalAportado._sum.valorAportado || 0,
      valorTotalRecebido: valorTotalRecebido._sum.valorTotalRecebido || 0,
      investimentosPorStatus: investimentosPorStatus.map((item) => ({
        status: item.statusInvestimento,
        count: item._count.statusInvestimento,
        valorTotal: item._sum.valorAportado || 0,
      })),
    }
  }
}