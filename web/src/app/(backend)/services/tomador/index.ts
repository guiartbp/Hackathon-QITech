import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.TomadorWhereUniqueInput;

function pickWhereUnique(params: { id?: string; uid_usuario?: string }): WhereUnique {
  if (params.id) return { id: parseInt(params.id) };
  if (params.uid_usuario) return { uidUsuario: params.uid_usuario };
  throw new Error('Informe id ou uid_usuario');
}

export async function createTomador(data: Prisma.TomadorCreateInput) {
  return prisma.tomador.create({ data });
}

export async function getTomador(params: { id?: string; uid_usuario?: string; cnpj?: string }) {
  const where = pickWhereUnique(params);
  return prisma.tomador.findUnique({ where });
}

export async function listTomadores(params?: { skip?: number; take?: number; search?: string }) {
  const { skip = 0, take = 50, search } = params ?? {};
  return prisma.tomador.findMany({
    skip,
    take,
    where: search
      ? {
          OR: [
            { razao_social: { contains: search, mode: 'insensitive' } },
            { cnpj: { contains: search, mode: 'insensitive' } },
            { uid_usuario: { equals: search } },
          ],
        }
      : undefined,
    orderBy: { atualizado_em: 'desc' },
  });
}

export async function updateTomador(
  params: { id?: string; uid_usuario?: string; cnpj?: string },
  data: Prisma.TomadorUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.tomador.update({ where, data });
}

export async function deleteTomador(params: { id?: string; uid_usuario?: string; cnpj?: string }) {
  const where = pickWhereUnique(params);
  return prisma.tomador.delete({ where });
}
