import { PrismaClient, ScoreFeature, Prisma } from '@/generated/prisma'
import { CreateScoreFeatureData, UpdateScoreFeatureData, ScoreFeatureQuery } from '../schemas/score-feature'

const prisma = new PrismaClient()

export class ScoreFeatureService {
  // Buscar todas as features de score com filtros e paginação
  async findMany(query: ScoreFeatureQuery): Promise<ScoreFeature[]> {
    const {
      scoreCategoriaId,
      featureNome,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.ScoreFeatureWhereInput = {}
    
    if (scoreCategoriaId) {
      where.scoreCategoriaId = scoreCategoriaId
    }
    
    if (featureNome) {
      where.featureNome = {
        contains: featureNome,
        mode: 'insensitive'
      }
    }

    return await prisma.scoreFeature.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
            score: {
              select: {
                id: true,
                scoreTotal: true,
                tier: true,
                tipoScore: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    nomeFantasia: true,
                  }
                }
              }
            }
          }
        },
      },
    })
  }

  // Buscar feature de score por ID
  async findById(id: string): Promise<ScoreFeature | null> {
    return await prisma.scoreFeature.findUnique({
      where: { id },
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
            score: {
              select: {
                id: true,
                scoreTotal: true,
                tier: true,
                tipoScore: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    nomeFantasia: true,
                  }
                }
              }
            }
          }
        },
      },
    })
  }

  // Criar nova feature de score
  async create(data: CreateScoreFeatureData): Promise<ScoreFeature> {
    // Verificar se a categoria de score existe
    const scoreCategoria = await prisma.scoreCategoria.findUnique({
      where: { id: data.scoreCategoriaId }
    })
    
    if (!scoreCategoria) {
      throw new Error('Categoria de score não encontrada')
    }

    return await prisma.scoreFeature.create({
      data,
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
            score: {
              select: {
                id: true,
                scoreTotal: true,
                tier: true,
                tipoScore: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    nomeFantasia: true,
                  }
                }
              }
            }
          }
        },
      },
    })
  }

  // Atualizar feature de score
  async update(id: string, data: UpdateScoreFeatureData): Promise<ScoreFeature> {
    // Verificar se a feature existe
    const existingFeature = await prisma.scoreFeature.findUnique({
      where: { id }
    })
    
    if (!existingFeature) {
      throw new Error('Feature de score não encontrada')
    }

    return await prisma.scoreFeature.update({
      where: { id },
      data,
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
            score: {
              select: {
                id: true,
                scoreTotal: true,
                tier: true,
                tipoScore: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    nomeFantasia: true,
                  }
                }
              }
            }
          }
        },
      },
    })
  }

  // Deletar feature de score
  async delete(id: string): Promise<ScoreFeature> {
    // Verificar se a feature existe
    const existingFeature = await prisma.scoreFeature.findUnique({
      where: { id }
    })
    
    if (!existingFeature) {
      throw new Error('Feature de score não encontrada')
    }

    return await prisma.scoreFeature.delete({
      where: { id },
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
            score: {
              select: {
                id: true,
                scoreTotal: true,
                tier: true,
                tipoScore: true,
                empresa: {
                  select: {
                    id: true,
                    razaoSocial: true,
                    nomeFantasia: true,
                  }
                }
              }
            }
          }
        },
      },
    })
  }

  // Contar total de features de score (para paginação)
  async count(query: Partial<ScoreFeatureQuery>): Promise<number> {
    const { scoreCategoriaId, featureNome } = query

    const where: Prisma.ScoreFeatureWhereInput = {}
    
    if (scoreCategoriaId) {
      where.scoreCategoriaId = scoreCategoriaId
    }
    
    if (featureNome) {
      where.featureNome = {
        contains: featureNome,
        mode: 'insensitive'
      }
    }

    return await prisma.scoreFeature.count({ where })
  }

  // Buscar features por categoria de score
  async findByScoreCategoria(scoreCategoriaId: string, limit: number = 10): Promise<ScoreFeature[]> {
    return await prisma.scoreFeature.findMany({
      where: { scoreCategoriaId },
      orderBy: { featurePeso: 'desc' },
      take: limit,
    })
  }

  // Buscar features com peso maior que determinado valor
  async findByMinWeight(minWeight: number, limit: number = 50): Promise<ScoreFeature[]> {
    return await prisma.scoreFeature.findMany({
      where: {
        featurePeso: {
          gte: minWeight
        }
      },
      orderBy: { featurePeso: 'desc' },
      take: limit,
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
          }
        },
      },
    })
  }

  // Buscar features com valor em determinada faixa
  async findByValueRange(minValue: number, maxValue: number, limit: number = 50): Promise<ScoreFeature[]> {
    return await prisma.scoreFeature.findMany({
      where: {
        featureValor: {
          gte: minValue,
          lte: maxValue
        }
      },
      orderBy: { featureValor: 'desc' },
      take: limit,
      include: {
        scoreCategoria: {
          select: {
            id: true,
            categoria: true,
            scoreCategoria: true,
          }
        },
      },
    })
  }
}

export const scoreFeatureService = new ScoreFeatureService()