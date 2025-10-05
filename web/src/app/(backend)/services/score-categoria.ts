import { PrismaClient, ScoreCategoria, Prisma } from '@/generated/prisma'
import { CreateScoreCategoriaData, UpdateScoreCategoriaData, ScoreCategoriaQuery } from '../schemas/score-categoria'

const prisma = new PrismaClient()

export class ScoreCategoriaService {
  // Buscar todas as categorias de score com filtros e paginação
  async findMany(query: ScoreCategoriaQuery): Promise<ScoreCategoria[]> {
    const {
      scoreId,
      categoria,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.ScoreCategoriaWhereInput = {}
    
    if (scoreId) {
      where.scoreId = scoreId
    }
    
    if (categoria) {
      where.categoria = {
        contains: categoria,
        mode: 'insensitive'
      }
    }

    return await prisma.scoreCategoria.findMany({
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
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }

  // Buscar categoria de score por ID
  async findById(id: string): Promise<ScoreCategoria | null> {
    return await prisma.scoreCategoria.findUnique({
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
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }

  // Criar nova categoria de score
  async create(data: CreateScoreCategoriaData): Promise<ScoreCategoria> {
    // Verificar se o score existe
    const score = await prisma.score.findUnique({
      where: { id: data.scoreId }
    })
    
    if (!score) {
      throw new Error('Score não encontrado')
    }

    // Verificar se já existe uma categoria com o mesmo nome para este score
    const existingCategoria = await prisma.scoreCategoria.findUnique({
      where: {
        scoreId_categoria: {
          scoreId: data.scoreId,
          categoria: data.categoria
        }
      }
    })

    if (existingCategoria) {
      throw new Error('Já existe uma categoria com este nome para este score')
    }

    return await prisma.scoreCategoria.create({
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
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }

  // Atualizar categoria de score
  async update(id: string, data: UpdateScoreCategoriaData): Promise<ScoreCategoria> {
    // Verificar se a categoria existe
    const existingCategoria = await prisma.scoreCategoria.findUnique({
      where: { id }
    })
    
    if (!existingCategoria) {
      throw new Error('Categoria de score não encontrada')
    }

    // Se está atualizando o nome da categoria, verificar duplicatas
    if (data.categoria) {
      const duplicateCategoria = await prisma.scoreCategoria.findFirst({
        where: {
          scoreId: existingCategoria.scoreId,
          categoria: data.categoria,
          id: { not: id } // Excluir o próprio registro
        }
      })

      if (duplicateCategoria) {
        throw new Error('Já existe uma categoria com este nome para este score')
      }
    }

    return await prisma.scoreCategoria.update({
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
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }

  // Deletar categoria de score
  async delete(id: string): Promise<ScoreCategoria> {
    // Verificar se a categoria existe
    const existingCategoria = await prisma.scoreCategoria.findUnique({
      where: { id }
    })
    
    if (!existingCategoria) {
      throw new Error('Categoria de score não encontrada')
    }

    return await prisma.scoreCategoria.delete({
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
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }

  // Contar total de categorias de score (para paginação)
  async count(query: Partial<ScoreCategoriaQuery>): Promise<number> {
    const { scoreId, categoria } = query

    const where: Prisma.ScoreCategoriaWhereInput = {}
    
    if (scoreId) {
      where.scoreId = scoreId
    }
    
    if (categoria) {
      where.categoria = {
        contains: categoria,
        mode: 'insensitive'
      }
    }

    return await prisma.scoreCategoria.count({ where })
  }

  // Buscar categorias por score
  async findByScore(scoreId: string, limit: number = 10): Promise<ScoreCategoria[]> {
    return await prisma.scoreCategoria.findMany({
      where: { scoreId },
      orderBy: { scoreCategoria: 'desc' },
      take: limit,
      include: {
        features: {
          orderBy: {
            criadoEm: 'desc'
          }
        },
      },
    })
  }
}

export const scoreCategoriaService = new ScoreCategoriaService()