import { PrismaClient, Insight, Prisma } from '@/generated/prisma'
import { CreateInsightData, UpdateInsightData, InsightQuery } from '../schemas/insight'

const prisma = new PrismaClient()

export class InsightService {
  // Buscar todos os insights com filtros e paginação
  async findMany(query: InsightQuery): Promise<Insight[]> {
    const {
      empresaId,
      tipo,
      categoria,
      titulo,
      isLido,
      isArquivado,
      dataExpiracaoInicio,
      dataExpiracaoFim,
      limit = 50,
      offset = 0,
      sortBy = 'criadoEm',
      sortOrder = 'desc'
    } = query

    const where: Prisma.InsightWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (tipo) {
      where.tipo = {
        contains: tipo,
        mode: 'insensitive'
      }
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

    if (isLido !== undefined) {
      where.isLido = isLido
    }

    if (isArquivado !== undefined) {
      where.isArquivado = isArquivado
    }

    // Filtro por faixa de data de expiração
    if (dataExpiracaoInicio || dataExpiracaoFim) {
      where.dataExpiracao = {}
      if (dataExpiracaoInicio) {
        where.dataExpiracao.gte = dataExpiracaoInicio
      }
      if (dataExpiracaoFim) {
        where.dataExpiracao.lte = dataExpiracaoFim
      }
    }

    return await prisma.insight.findMany({
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
      },
    })
  }

  // Buscar insight por ID
  async findById(id: string): Promise<Insight | null> {
    return await prisma.insight.findUnique({
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
      },
    })
  }

  // Criar novo insight
  async create(data: CreateInsightData): Promise<Insight> {
    // Verificar se a empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: data.empresaId }
    })
    
    if (!empresa) {
      throw new Error('Empresa não encontrada')
    }

    return await prisma.insight.create({
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
      },
    })
  }

  // Atualizar insight
  async update(id: string, data: UpdateInsightData): Promise<Insight> {
    // Verificar se o insight existe
    const existingInsight = await prisma.insight.findUnique({
      where: { id }
    })
    
    if (!existingInsight) {
      throw new Error('Insight não encontrado')
    }

    return await prisma.insight.update({
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
      },
    })
  }

  // Deletar insight
  async delete(id: string): Promise<Insight> {
    // Verificar se o insight existe
    const existingInsight = await prisma.insight.findUnique({
      where: { id }
    })
    
    if (!existingInsight) {
      throw new Error('Insight não encontrado')
    }

    return await prisma.insight.delete({
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
      },
    })
  }

  // Contar total de insights (para paginação)
  async count(query: Partial<InsightQuery>): Promise<number> {
    const { 
      empresaId, 
      tipo, 
      categoria, 
      titulo, 
      isLido, 
      isArquivado, 
      dataExpiracaoInicio, 
      dataExpiracaoFim 
    } = query

    const where: Prisma.InsightWhereInput = {}
    
    if (empresaId) {
      where.empresaId = empresaId
    }
    
    if (tipo) {
      where.tipo = {
        contains: tipo,
        mode: 'insensitive'
      }
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

    if (isLido !== undefined) {
      where.isLido = isLido
    }

    if (isArquivado !== undefined) {
      where.isArquivado = isArquivado
    }

    if (dataExpiracaoInicio || dataExpiracaoFim) {
      where.dataExpiracao = {}
      if (dataExpiracaoInicio) {
        where.dataExpiracao.gte = dataExpiracaoInicio
      }
      if (dataExpiracaoFim) {
        where.dataExpiracao.lte = dataExpiracaoFim
      }
    }

    return await prisma.insight.count({ where })
  }

  // Buscar insights por empresa
  async findByEmpresa(empresaId: string, limit: number = 10): Promise<Insight[]> {
    return await prisma.insight.findMany({
      where: { empresaId },
      orderBy: { criadoEm: 'desc' },
      take: limit,
    })
  }

  // Buscar insights não lidos
  async findUnread(empresaId?: string, limit: number = 50): Promise<Insight[]> {
    const where: Prisma.InsightWhereInput = {
      isLido: false,
      isArquivado: false
    }

    if (empresaId) {
      where.empresaId = empresaId
    }

    return await prisma.insight.findMany({
      where,
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

  // Buscar insights por tipo
  async findByTipo(tipo: string, limit: number = 50): Promise<Insight[]> {
    return await prisma.insight.findMany({
      where: {
        tipo: {
          contains: tipo,
          mode: 'insensitive'
        },
        isArquivado: false
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

  // Buscar insights expirados
  async findExpired(limit: number = 50): Promise<Insight[]> {
    return await prisma.insight.findMany({
      where: {
        dataExpiracao: {
          lte: new Date()
        },
        isArquivado: false
      },
      orderBy: { dataExpiracao: 'asc' },
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

  // Marcar insight como lido
  async markAsRead(id: string): Promise<Insight> {
    return await this.update(id, { isLido: true })
  }

  // Marcar insight como arquivado
  async markAsArchived(id: string): Promise<Insight> {
    return await this.update(id, { isArquivado: true })
  }

  // Buscar insights próximos ao vencimento (próximos 7 dias)
  async findExpiringSoon(days: number = 7, limit: number = 50): Promise<Insight[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return await prisma.insight.findMany({
      where: {
        dataExpiracao: {
          gte: new Date(),
          lte: futureDate
        },
        isArquivado: false
      },
      orderBy: { dataExpiracao: 'asc' },
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
}

export const insightService = new InsightService()