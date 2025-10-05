import { PrismaClient, Prisma } from '../../../../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type WhereUnique = Prisma.DadosBancariosWhereUniqueInput;

function pickWhereUnique(params: {
  id?: string;
}): WhereUnique {
  if (params.id) return { id: params.id };
  throw new Error('Informe id');
}

export async function createDadosBancarios(data: Prisma.DadosBancariosCreateInput) {
  return prisma.dadosBancarios.create({ data });
}

export async function getDadosBancarios(params: {
  id?: string;
}) {
  const where = pickWhereUnique(params);
  return prisma.dadosBancarios.findUnique({ where });
}

export async function listDadosBancarios(params?: {
  skip?: number;
  take?: number;
  search?: string;
  usuario_id?: string;
  tipo_usuario?: string;
  is_principal?: string;
}) {
  const { skip = 0, take = 50, search, usuario_id, tipo_usuario, is_principal } = params ?? {};
  
  const where: any = {};

  // Filtros específicos
  if (usuario_id) {
    where.usuarioId = usuario_id;
  }
  
  if (tipo_usuario) {
    where.tipoUsuario = tipo_usuario;
  }
  
  if (is_principal) {
    where.isPrincipal = is_principal === 'true';
  }

  // Busca textual
  if (search) {
    where.OR = [
      { banco: { contains: search, mode: 'insensitive' } },
      { agencia: { contains: search, mode: 'insensitive' } },
      { conta: { contains: search, mode: 'insensitive' } },
      { ispb: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.dadosBancarios.findMany({
    skip,
    take,
    where,
    orderBy: { atualizadoEm: 'desc' },
  });
}

export async function listDadosBancariosByUser(params: {
  usuario_id: string;
  tipo_usuario: string;
}) {
  return prisma.dadosBancarios.findMany({
    where: {
      usuarioId: params.usuario_id,
      tipoUsuario: params.tipo_usuario,
    },
    orderBy: { atualizadoEm: 'desc' },
  });
}

export async function updateDadosBancarios(
  params: { id?: string },
  data: Prisma.DadosBancariosUpdateInput
) {
  const where = pickWhereUnique(params);
  return prisma.dadosBancarios.update({ where, data });
}

export async function deleteDadosBancarios(params: {
  id?: string;
}) {
  const where = pickWhereUnique(params);
  return prisma.dadosBancarios.delete({ where });
}