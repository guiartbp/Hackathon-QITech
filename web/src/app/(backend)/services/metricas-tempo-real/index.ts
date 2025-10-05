import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.MetricasTempoRealWhereUniqueInput;

function pickWhereUnique(params: { id?: string }): WhereUnique {
  if (params.id) return { id: params.id };
  throw new Error('Informe id');
}

export async function createMetricasTempoReal(data: Prisma.MetricasTempoRealCreateInput) {
  return prisma.metricasTempoReal.create({ 
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
}

export async function getMetricasTempoReal(params: { id?: string }) {
  const where = pickWhereUnique(params);
  return prisma.metricasTempoReal.findUnique({ 
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

export async function listMetricasTempoReal(params: {
  empresa_id?: string;
  timestamp_captura?: string;
  search?: string;
  skip?: number;
  take?: number;
}) {
  const where: Prisma.MetricasTempoRealWhereInput = {};
  
  if (params.empresa_id) {
    where.empresaId = params.empresa_id;
  }
  
  if (params.timestamp_captura) {
    where.timestampCaptura = new Date(params.timestamp_captura);
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

  const [items, total] = await Promise.all([
    prisma.metricasTempoReal.findMany({
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
      orderBy: [
        { timestampCaptura: 'desc' },
        { criadoEm: 'desc' }
      ],
      skip: params.skip ?? 0,
      take: params.take ?? 20,
    }),
    prisma.metricasTempoReal.count({ where }),
  ]);

  return { items, total };
}

export async function updateMetricasTempoReal(
  params: { id?: string },
  data: Prisma.MetricasTempoRealUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.metricasTempoReal.update({
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
}

export async function deleteMetricasTempoReal(params: { id?: string }) {
  const where = pickWhereUnique(params);
  return prisma.metricasTempoReal.delete({
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

export async function getMetricasTempoRealPorEmpresa(empresaId: string, params: {
  timestamp_captura?: string;
  skip?: number;
  take?: number;
}) {
  const where: Prisma.MetricasTempoRealWhereInput = {
    empresaId,
  };
  
  if (params.timestamp_captura) {
    where.timestampCaptura = new Date(params.timestamp_captura);
  }

  const [items, total] = await Promise.all([
    prisma.metricasTempoReal.findMany({
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
      orderBy: [
        { timestampCaptura: 'desc' },
        { criadoEm: 'desc' }
      ],
      skip: params.skip ?? 0,
      take: params.take ?? 20,
    }),
    prisma.metricasTempoReal.count({ where }),
  ]);

  return { items, total };
}

export async function getLatestMetricasTempoRealPorEmpresa(empresaId: string) {
  return prisma.metricasTempoReal.findFirst({
    where: {
      empresaId,
    },
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
    orderBy: {
      timestampCaptura: 'desc',
    },
  });
}