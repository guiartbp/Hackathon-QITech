import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.MetricasMensaisWhereUniqueInput;

function pickWhereUnique(params: { id?: string; empresaId?: string; mesReferencia?: string }): WhereUnique {
  if (params.id) return { id: params.id };
  if (params.empresaId && params.mesReferencia) {
    return { 
      empresaId_mesReferencia: { 
        empresaId: params.empresaId, 
        mesReferencia: new Date(params.mesReferencia) 
      } 
    };
  }
  throw new Error('Informe id ou empresaId + mesReferencia');
}

export async function createMetricasMensais(data: Prisma.MetricasMensaisCreateInput) {
  try {
    return await prisma.metricasMensais.create({ 
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
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Já existem métricas mensais para esta empresa e período');
      }
      if (error.code === 'P2003') {
        throw new Error('Empresa não encontrada');
      }
    }
    throw error;
  }
}

export async function getMetricasMensais(params: { 
  id?: string; 
  empresaId?: string; 
  mesReferencia?: string; 
}) {
  const where = pickWhereUnique(params);
  return prisma.metricasMensais.findUnique({ 
    where,
    include: {
      empresa: {
        select: {
          id: true,
          razaoSocial: true,
          nomeFantasia: true,
          cnpj: true,
        }
      },
    }
  });
}

export async function listMetricasMensais(params: {
  empresaId?: string;
  mesReferencia?: string;
  search?: string;
  skip?: number;
  take?: number;
  sortBy?: 'mesReferencia' | 'criadoEm' | 'mrrFinal';
  sortOrder?: 'asc' | 'desc';
}) {
  const where: Prisma.MetricasMensaisWhereInput = {};
  
  if (params.empresaId) {
    where.empresaId = params.empresaId;
  }
  
  if (params.mesReferencia) {
    const date = new Date(params.mesReferencia);
    // Buscar por mês e ano
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    where.mesReferencia = {
      gte: startOfMonth,
      lte: endOfMonth,
    };
  }
  
  if (params.search) {
    where.OR = [
      { empresa: { 
        OR: [
          { razaoSocial: { contains: params.search, mode: 'insensitive' } },
          { nomeFantasia: { contains: params.search, mode: 'insensitive' } },
          { cnpj: { contains: params.search, mode: 'insensitive' } }
        ]
      }},
    ];
  }

  // Configurar ordenação
  const orderBy: Prisma.MetricasMensaisOrderByWithRelationInput[] = [];
  const sortField = params.sortBy || 'mesReferencia';
  const sortDirection = params.sortOrder || 'desc';
  
  orderBy.push({ [sortField]: sortDirection });
  
  // Ordenação secundária sempre por data de criação
  if (sortField !== 'criadoEm') {
    orderBy.push({ criadoEm: 'desc' });
  }

  const [items, total] = await Promise.all([
    prisma.metricasMensais.findMany({
      where,
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
      orderBy,
      skip: params.skip ?? 0,
      take: params.take ?? 20,
    }),
    prisma.metricasMensais.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: Math.floor((params.skip ?? 0) / (params.take ?? 20)) + 1,
      limit: params.take ?? 20,
      totalPages: Math.ceil(total / (params.take ?? 20)),
    },
  };
}

export async function updateMetricasMensais(
  params: { id?: string; empresaId?: string; mesReferencia?: string },
  data: Prisma.MetricasMensaisUpdateInput
) {
  try {
    const where = pickWhereUnique(params);
    return await prisma.metricasMensais.update({
      where,
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
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error('Métricas mensais não encontradas');
      }
      if (error.code === 'P2002') {
        throw new Error('Já existem métricas mensais para esta empresa e período');
      }
    }
    throw error;
  }
}

export async function deleteMetricasMensais(params: { 
  id?: string; 
  empresaId?: string; 
  mesReferencia?: string; 
}) {
  try {
    const where = pickWhereUnique(params);
    return await prisma.metricasMensais.delete({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          }
        },
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error('Métricas mensais não encontradas');
      }
    }
    throw error;
  }
}

// Função para obter métricas de uma empresa por período
export async function getMetricasPorEmpresa(
  empresaId: string,
  params: {
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
  } = {}
) {
  const where: Prisma.MetricasMensaisWhereInput = {
    empresaId,
  };

  if (params.startDate || params.endDate) {
    where.mesReferencia = {};
    if (params.startDate) {
      where.mesReferencia.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      where.mesReferencia.lte = new Date(params.endDate);
    }
  }

  const [items, total] = await Promise.all([
    prisma.metricasMensais.findMany({
      where,
      orderBy: [
        { mesReferencia: 'desc' },
        { criadoEm: 'desc' }
      ],
      skip: params.skip ?? 0,
      take: params.take ?? 12, // Default 12 meses
    }),
    prisma.metricasMensais.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: Math.floor((params.skip ?? 0) / (params.take ?? 12)) + 1,
      limit: params.take ?? 12,
      totalPages: Math.ceil(total / (params.take ?? 12)),
    },
  };
}

// Função para obter resumo estatístico das métricas
export async function getResumoMetricas(empresaId?: string) {
  const where: Prisma.MetricasMensaisWhereInput = empresaId ? { empresaId } : {};
  
  const result = await prisma.metricasMensais.aggregate({
    where,
    _avg: {
      mrrFinal: true,
      arrFinal: true,
      ticketMedio: true,
      churnRateMedio: true,
      margemBruta: true,
    },
    _max: {
      mrrFinal: true,
      arrFinal: true,
      numClientesFinal: true,
    },
    _min: {
      churnRateMedio: true,
      cacPaybackMeses: true,
    },
    _count: {
      id: true,
    }
  });

  return result;
}