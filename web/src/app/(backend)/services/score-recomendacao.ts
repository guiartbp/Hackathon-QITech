import { PrismaClient, ScoreRecomendacao, Prisma } from '@/generated/prisma'
import { CreateScoreRecomendacaoData, UpdateScoreRecomendacaoData, ScoreRecomendacaoQuery } from '../schemas/score-recomendacao'

const prisma = new PrismaClient()

export class ScoreRecomendacaoService {
  // Buscar todas as recomendações de score com filtros e paginação
  async findMany(query: ScoreRecomendacaoQuery): Promise<ScoreRecomendacao[]> {
    const {
      scoreId,
      categoria,
      titulo,
      prioridade,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.ScoreRecomendacaoWhereInput = {}
    
    if (scoreId) {
      where.scoreId = scoreId
    }
    
    if (categoria) {
      where.categoria = {
        contains: categoria,
        mode: 'insensitive'
      }
    }

    if (titulo) {
      where.titulo = {
        contains: titulo,
        mode: 'insensitive'
      }
    }

    if (prioridade) {
      where.prioridade = prioridade
    }

    return await prisma.scoreRecomendacao.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
      include: {
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
        },
      },
    })
  }

  // Buscar recomendação de score por ID
  async findById(id: string): Promise<ScoreRecomendacao | null> {
    return await prisma.scoreRecomendacao.findUnique({
      where: { id },
      include: {
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
        },
      },
    })
  }

  // Criar nova recomendação de score
  async create(data: CreateScoreRecomendacaoData): Promise<ScoreRecomendacao> {
    // Verificar se o score existe
    const score = await prisma.score.findUnique({
      where: { id: data.scoreId }
    })
    
    if (!score) {
      throw new Error('Score não encontrado')
    }

    return await prisma.scoreRecomendacao.create({
      data,
      include: {
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
        },
      },
    })
  }

  // Atualizar recomendação de score
  async update(id: string, data: UpdateScoreRecomendacaoData): Promise<ScoreRecomendacao> {
    // Verificar se a recomendação existe
    const existingRecomendacao = await prisma.scoreRecomendacao.findUnique({
      where: { id }
    })
    
    if (!existingRecomendacao) {
      throw new Error('Recomendação de score não encontrada')
    }

    return await prisma.scoreRecomendacao.update({
      where: { id },
      data,
      include: {
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
        },
      },
    })
  }

  // Deletar recomendação de score
  async delete(id: string): Promise<ScoreRecomendacao> {
    // Verificar se a recomendação existe
    const existingRecomendacao = await prisma.scoreRecomendacao.findUnique({
      where: { id }
    })
    
    if (!existingRecomendacao) {
      throw new Error('Recomendação de score não encontrada')
    }

    return await prisma.scoreRecomendacao.delete({
      where: { id },
      include: {
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
        },
      },
    })
  }

  // Contar total de recomendações de score (para paginação)
  async count(query: Partial<ScoreRecomendacaoQuery>): Promise<number> {
    const { scoreId, categoria, titulo, prioridade } = query

    const where: Prisma.ScoreRecomendacaoWhereInput = {}
    
    if (scoreId) {
      where.scoreId = scoreId
    }
    
    if (categoria) {
      where.categoria = {
        contains: categoria,
        mode: 'insensitive'
      }
    }

    if (titulo) {
      where.titulo = {
        contains: titulo,
        mode: 'insensitive'
      }
    }

    if (prioridade) {
      where.prioridade = prioridade
    }

    return await prisma.scoreRecomendacao.count({ where })
  }

  // Buscar recomendações por score
  async findByScore(scoreId: string, limit: number = 10): Promise<ScoreRecomendacao[]> {
    return await prisma.scoreRecomendacao.findMany({
      where: { scoreId },
      orderBy: { prioridade: 'desc' },
      take: limit,
    })
  }

  // Buscar recomendações por categoria
  async findByCategoria(categoria: string, limit: number = 50): Promise<ScoreRecomendacao[]> {
    return await prisma.scoreRecomendacao.findMany({
      where: {
        categoria: {
          contains: categoria,
          mode: 'insensitive'
        }
      },
      orderBy: { prioridade: 'desc' },
      take: limit,
      include: {
        score: {
          select: {
            id: true,
            scoreTotal: true,
            tier: true,
          }
        },
      },
    })
  }

  // Buscar recomendações com alta prioridade
  async findHighPriority(minPrioridade: number = 7, limit: number = 50): Promise<ScoreRecomendacao[]> {
    return await prisma.scoreRecomendacao.findMany({
      where: {
        prioridade: {
          gte: minPrioridade
        }
      },
      orderBy: { prioridade: 'desc' },
      take: limit,
      include: {
        score: {
          select: {
            id: true,
            scoreTotal: true,
            tier: true,
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
              }
            }
          }
        },
      },
    })
  }

  // Buscar recomendações com maior impacto estimado
  async findHighImpact(minImpacto: number = 50, limit: number = 50): Promise<ScoreRecomendacao[]> {
    return await prisma.scoreRecomendacao.findMany({
      where: {
        impactoEstimado: {
          gte: minImpacto
        }
      },
      orderBy: { impactoEstimado: 'desc' },
      take: limit,
      include: {
        score: {
          select: {
            id: true,
            scoreTotal: true,
            tier: true,
          }
        },
      },
    })
  }
}

export const scoreRecomendacaoService = new ScoreRecomendacaoService()