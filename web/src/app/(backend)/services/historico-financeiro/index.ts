import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.HistoricoFinanceiroWhereUniqueInput;

function pickWhereUnique(params: { id?: string }): WhereUnique {
  if (params.id) return { id: params.id };
  throw new Error('Informe id');
}

export async function createHistoricoFinanceiro(data: Prisma.HistoricoFinanceiroCreateInput) {
  return prisma.historicoFinanceiro.create({ 
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

export async function getHistoricoFinanceiro(params: { id?: string }) {
  const where = pickWhereUnique(params);
  return prisma.historicoFinanceiro.findUnique({ 
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

export async function listHistoricoFinanceiro(params: {
  empresa_id?: string;
  periodo?: string;
  tipo_relatorio?: string;
  search?: string;
  skip?: number;
  take?: number;
}) {
  const where: Prisma.HistoricoFinanceiroWhereInput = {};
  
  if (params.empresa_id) {
    where.empresaId = params.empresa_id;
  }
  
  if (params.periodo) {
    where.periodo = new Date(params.periodo);
  }
  
  if (params.tipo_relatorio) {
    where.tipoRelatorio = params.tipo_relatorio;
  }
  
  if (params.search) {
    where.OR = [
      { tipoRelatorio: { contains: params.search, mode: 'insensitive' } },
      { fonteDados: { contains: params.search, mode: 'insensitive' } },
      { verificadoPor: { contains: params.search, mode: 'insensitive' } },
      { obrigacoesDivida: { contains: params.search, mode: 'insensitive' } },
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
    prisma.historicoFinanceiro.findMany({
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
        { periodo: 'desc' },
        { criadoEm: 'desc' }
      ],
      skip: params.skip ?? 0,
      take: params.take ?? 20,
    }),
    prisma.historicoFinanceiro.count({ where }),
  ]);

  return { items, total };
}

export async function updateHistoricoFinanceiro(
  params: { id?: string },
  data: Prisma.HistoricoFinanceiroUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.historicoFinanceiro.update({
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

export async function deleteHistoricoFinanceiro(params: { id?: string }) {
  const where = pickWhereUnique(params);
  return prisma.historicoFinanceiro.delete({
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

export async function getHistoricoFinanceiroPorEmpresa(empresaId: string, params: {
  periodo?: string;
  tipo_relatorio?: string;
  skip?: number;
  take?: number;
}) {
  const where: Prisma.HistoricoFinanceiroWhereInput = {
    empresaId,
  };
  
  if (params.periodo) {
    where.periodo = new Date(params.periodo);
  }
  
  if (params.tipo_relatorio) {
    where.tipoRelatorio = params.tipo_relatorio;
  }

  const [items, total] = await Promise.all([
    prisma.historicoFinanceiro.findMany({
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
        { periodo: 'desc' },
        { criadoEm: 'desc' }
      ],
      skip: params.skip ?? 0,
      take: params.take ?? 20,
    }),
    prisma.historicoFinanceiro.count({ where }),
  ]);

  return { items, total };
}