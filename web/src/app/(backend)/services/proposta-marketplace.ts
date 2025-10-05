import { PrismaClient } from '@/generated/prisma'
import { MarketplaceQuery } from '../schemas/proposta'

const prisma = new PrismaClient()

export class PropostaMarketplaceService {
  // Buscar propostas para marketplace
  async findForMarketplace(query: MarketplaceQuery) {
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

    const whereConditions: Record<string, unknown> = {}

    // Status filtering
    if (statusFunding) {
      whereConditions.statusFunding = {
        contains: statusFunding,
        mode: 'insensitive'
      }
    } else {
      whereConditions.statusFunding = {
        in: ['ABERTA', 'ATIVA', 'EM_ANDAMENTO']
      }
    }

    // Value range filtering
    if (valorSolicitadoMin || valorSolicitadoMax) {
      whereConditions.valorSolicitado = {}
      if (valorSolicitadoMin) {
        whereConditions.valorSolicitado.gte = valorSolicitadoMin
      }
      if (valorSolicitadoMax) {
        whereConditions.valorSolicitado.lte = valorSolicitadoMax
      }
    }

    // Progress filtering
    if (progressoFundingMin || progressoFundingMax) {
      whereConditions.progressoFunding = {}
      if (progressoFundingMin) {
        whereConditions.progressoFunding.gte = progressoFundingMin
      }
      if (progressoFundingMax) {
        whereConditions.progressoFunding.lte = progressoFundingMax
      }
    }

    // Company filters
    const empresaFilters: Record<string, unknown> = {}

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

    // Score filters
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
      whereConditions.empresa = empresaFilters
    }

    // Order by mapping - simplified for now
    const orderByClause = sortBy === 'scoreTotal' ? { empresa: { scores: { _count: sortOrder } } } : { [sortBy]: sortOrder }

    const propostas = await prisma.proposta.findMany({
      where: whereConditions,
      orderBy: orderByClause,
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

    // Transform data for marketplace format
    return propostas.map((proposta) => {
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
        rendimento: Number(proposta.multiploCap) * 100 - 100,
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
}

export const propostaMarketplaceService = new PropostaMarketplaceService()