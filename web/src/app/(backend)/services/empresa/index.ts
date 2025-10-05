import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.EmpresaWhereUniqueInput;

function pickWhereUnique(params: { id?: string; tomador_id?: string; cnpj?: string }): WhereUnique {
  if (params.id) return { id: params.id };
  if (params.tomador_id) return { tomadorId: params.tomador_id };
  if (params.cnpj) return { cnpj: params.cnpj };
  throw new Error('Informe id, tomador_id ou cnpj');
}

export async function createEmpresa(data: Prisma.EmpresaCreateInput) {
  return prisma.empresa.create({ 
    data,
    include: {
      tomador: true,
    }
  });
}

export async function getEmpresa(params: { id?: string; tomador_id?: string; cnpj?: string }) {
  const where = pickWhereUnique(params);
  return prisma.empresa.findUnique({ 
    where,
    include: {
      tomador: true,
      metricasTempoReal: {
        orderBy: { timestampCaptura: 'desc' },
        take: 1,
      },
      metricasMensais: {
        orderBy: { mesReferencia: 'desc' },
        take: 3,
      },
      scores: {
        orderBy: { criadoEm: 'desc' },
        take: 1,
      },
    }
  });
}

export async function listEmpresas(params?: { skip?: number; take?: number; search?: string }) {
  const { skip = 0, take = 50, search } = params ?? {};
  return prisma.empresa.findMany({
    skip,
    take,
    where: search
      ? {
          OR: [
            { razaoSocial: { contains: search, mode: 'insensitive' } },
            { nomeFantasia: { contains: search, mode: 'insensitive' } },
            { cnpj: { contains: search, mode: 'insensitive' } },
            { tomador: { nomeCompleto: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: {
      tomador: true,
      metricasTempoReal: {
        orderBy: { timestampCaptura: 'desc' },
        take: 1,
      },
      scores: {
        orderBy: { criadoEm: 'desc' },
        take: 1,
      },
    },
    orderBy: { atualizadoEm: 'desc' },
  });
}

export async function updateEmpresa(
  params: { id?: string; tomador_id?: string; cnpj?: string },
  data: Prisma.EmpresaUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.empresa.update({ 
    where, 
    data,
    include: {
      tomador: true,
    }
  });
}

export async function deleteEmpresa(params: { id?: string; tomador_id?: string; cnpj?: string }) {
  const where = pickWhereUnique(params);
  return prisma.empresa.delete({ 
    where,
    include: {
      tomador: true,
    }
  });
}

// Funções específicas para métricas e dados relacionados
export async function getEmpresaWithMetrics(empresaId: string) {
  return prisma.empresa.findUnique({
    where: { id: empresaId },
    include: {
      tomador: true,
      metricasTempoReal: {
        orderBy: { timestampCaptura: 'desc' },
        take: 10,
      },
      metricasMensais: {
        orderBy: { mesReferencia: 'desc' },
        take: 12,
      },
      evolucaoMetricas: {
        orderBy: { dataReferencia: 'desc' },
        take: 24,
      },
      scores: {
        orderBy: { criadoEm: 'desc' },
        take: 5,
        include: {
          categorias: true,
          recomendacoes: true,
        },
      },
      propostas: {
        orderBy: { criadoEm: 'desc' },
        include: {
          contrato: true,
        },
      },
    },
  });
}

