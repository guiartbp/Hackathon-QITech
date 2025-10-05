import { PrismaClient, Score, Prisma } from '@/generated/prisma'
import { CreateScoreData, UpdateScoreData, ScoreQuery } from '../schemas/score'

const prisma = new PrismaClient()

export class ScoreService {
  // Buscar todos os scores com filtros e paginação
  async findMany(query: ScoreQuery): Promise<Score[]> {
    const {
      empresaId,
      tier,
      tipoScore,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.ScoreWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (tier) {
      where.tier = tier
    }
    
    if (tipoScore) {
      where.tipoScore = tipoScore
    }

    return await prisma.score.findMany({
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
          }
        },
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }

  // Buscar score por ID
  async findById(id: string): Promise<Score | null> {
    return await prisma.score.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }

  // Criar novo score
  async create(data: CreateScoreData): Promise<Score> {
    // Verificar se a empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: data.empresaId }
    })
    
    if (!empresa) {
      throw new Error('Empresa não encontrada')
    }

    return await prisma.score.create({
      data,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }

  // Atualizar score
  async update(id: string, data: UpdateScoreData): Promise<Score> {
    // Verificar se o score existe
    const existingScore = await prisma.score.findUnique({
      where: { id }
    })
    
    if (!existingScore) {
      throw new Error('Score não encontrado')
    }

    return await prisma.score.update({
      where: { id },
      data,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }

  // Deletar score
  async delete(id: string): Promise<Score> {
    // Verificar se o score existe
    const existingScore = await prisma.score.findUnique({
      where: { id }
    })
    
    if (!existingScore) {
      throw new Error('Score não encontrado')
    }

    return await prisma.score.delete({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          }
        },
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }

  // Contar total de scores (para paginação)
  async count(query: Partial<ScoreQuery>): Promise<number> {
    const { empresaId, tier, tipoScore } = query

    const where: Prisma.ScoreWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (tier) {
      where.tier = tier
    }
    
    if (tipoScore) {
      where.tipoScore = tipoScore
    }

    return await prisma.score.count({ where })
  }

  // Buscar últimos scores de uma empresa
  async findLatestByEmpresa(empresaId: string, limit: number = 10): Promise<Score[]> {
    return await prisma.score.findMany({
      where: { empresaId },
      orderBy: { criadoEm: 'desc' },
      take: limit,
      include: {
        categorias: {
          include: {
            features: true
          }
        },
        recomendacoes: true,
      },
    })
  }
}

export const scoreService = new ScoreService()