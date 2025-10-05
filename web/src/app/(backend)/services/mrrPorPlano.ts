import { PrismaClient } from '@/generated/prisma';
import { CreateMrrPorPlanoInput, UpdateMrrPorPlanoInput, QueryMrrPorPlanoInput } from '@/app/(backend)/schemas/mrrPorPlano';

const prisma = new PrismaClient();

export class MrrPorPlanoService {
  async create(data: CreateMrrPorPlanoInput) {
    try {
      const mrrPorPlano = await prisma.mrrPorPlano.create({
        data: {
          empresaId: data.empresaId,
          mesReferencia: data.mesReferencia,
          nomePlano: data.nomePlano,
          mrrPlano: data.mrrPlano,
          numClientesPlano: data.numClientesPlano,
          percentualTotal: data.percentualTotal,
        },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            },
          },
        },
      });

      return mrrPorPlano;
    } catch (error) {
      console.error('Erro ao criar MRR por plano:', error);
      throw new Error('Erro interno do servidor ao criar MRR por plano');
    }
  }

  async findMany(query: QueryMrrPorPlanoInput) {
    try {
      const { page, limit, orderBy, orderDirection, empresaId, mesReferencia, nomePlano } = query;
      
      const skip = (page - 1) * limit;
      
      const where = {
        ...(empresaId && { empresaId }),
        ...(mesReferencia && { 
          mesReferencia: {
            equals: new Date(mesReferencia),
          },
        }),
        ...(nomePlano && { 
          nomePlano: {
            contains: nomePlano,
            mode: 'insensitive' as const,
          },
        }),
      };

      const [mrrPorPlanos, total] = await Promise.all([
        prisma.mrrPorPlano.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [orderBy]: orderDirection,
          },
          include: {
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                cnpj: true,
              },
            },
          },
        }),
        prisma.mrrPorPlano.count({ where }),
      ]);

      return {
        data: mrrPorPlanos,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Erro ao buscar MRR por planos:', error);
      throw new Error('Erro interno do servidor ao buscar MRR por planos');
    }
  }

  async findById(id: string) {
    try {
      const mrrPorPlano = await prisma.mrrPorPlano.findUnique({
        where: { id },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            },
          },
        },
      });

      if (!mrrPorPlano) {
        throw new Error('MRR por plano não encontrado');
      }

      return mrrPorPlano;
    } catch (error) {
      console.error('Erro ao buscar MRR por plano:', error);
      if (error instanceof Error && error.message === 'MRR por plano não encontrado') {
        throw error;
      }
      throw new Error('Erro interno do servidor ao buscar MRR por plano');
    }
  }

  async update(id: string, data: UpdateMrrPorPlanoInput) {
    try {
      const existingMrrPorPlano = await prisma.mrrPorPlano.findUnique({
        where: { id },
      });

      if (!existingMrrPorPlano) {
        throw new Error('MRR por plano não encontrado');
      }

      const mrrPorPlano = await prisma.mrrPorPlano.update({
        where: { id },
        data: {
          ...(data.empresaId && { empresaId: data.empresaId }),
          ...(data.mesReferencia && { mesReferencia: data.mesReferencia }),
          ...(data.nomePlano && { nomePlano: data.nomePlano }),
          ...(data.mrrPlano && { mrrPlano: data.mrrPlano }),
          ...(data.numClientesPlano !== undefined && { numClientesPlano: data.numClientesPlano }),
          ...(data.percentualTotal !== undefined && { percentualTotal: data.percentualTotal }),
        },
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            },
          },
        },
      });

      return mrrPorPlano;
    } catch (error) {
      console.error('Erro ao atualizar MRR por plano:', error);
      if (error instanceof Error && error.message === 'MRR por plano não encontrado') {
        throw error;
      }
      throw new Error('Erro interno do servidor ao atualizar MRR por plano');
    }
  }

  async delete(id: string) {
    try {
      const existingMrrPorPlano = await prisma.mrrPorPlano.findUnique({
        where: { id },
      });

      if (!existingMrrPorPlano) {
        throw new Error('MRR por plano não encontrado');
      }

      await prisma.mrrPorPlano.delete({
        where: { id },
      });

      return { message: 'MRR por plano deletado com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar MRR por plano:', error);
      if (error instanceof Error && error.message === 'MRR por plano não encontrado') {
        throw error;
      }
      throw new Error('Erro interno do servidor ao deletar MRR por plano');
    }
  }
}

export const mrrPorPlanoService = new MrrPorPlanoService();