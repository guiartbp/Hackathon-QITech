import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.InvestidorWhereUniqueInput;

function pickWhereUnique(params: {
  id?: string;
  uid_usuario?: string;
  documento_identificacao?: string;
}): WhereUnique {
  if (params.id) return { id: params.id };
  if (params.uid_usuario) return { uid_usuario: params.uid_usuario };
  if (params.documento_identificacao) return { documento_identificacao: params.documento_identificacao };
  throw new Error('Informe id, uid_usuario ou documento_identificacao');
}

export async function createInvestidor(data: Prisma.InvestidorCreateInput) {
  return prisma.investidor.create({ data });
}

export async function getInvestidor(params: {
  id?: string;
  uid_usuario?: string;
  documento_identificacao?: string;
}) {
  const where = pickWhereUnique(params);
  return prisma.investidor.findUnique({ where });
}

export async function listInvestidores(params?: {
  skip?: number;
  take?: number;
  search?: string;
}) {
  const { skip = 0, take = 50, search } = params ?? {};
  return prisma.investidor.findMany({
    skip,
    take,
    where: search
      ? {
          OR: [
            { nome_razao_social: { contains: search, mode: 'insensitive' } },
            { documento_identificacao: { contains: search, mode: 'insensitive' } },
            { uid_usuario: { equals: search } },
          ],
        }
      : undefined,
    orderBy: { atualizado_em: 'desc' },
  });
}

export async function updateInvestidor(
  params: { id?: string; uid_usuario?: string; documento_identificacao?: string },
  data: Prisma.InvestidorUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.investidor.update({ where, data });
}

export async function deleteInvestidor(params: {
  id?: string;
  uid_usuario?: string;
  documento_identificacao?: string;
}) {
  const where = pickWhereUnique(params);
  return prisma.investidor.delete({ where });
}
