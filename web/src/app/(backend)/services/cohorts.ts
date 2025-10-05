import { PrismaClient } from '@/generated/prisma';
import type {
  CreateCohortsInput,
  UpdateCohortsInput,
  CohortsQueryParams,
} from '@/app/(backend)/schemas/cohorts';

const prisma = new PrismaClient();

export class CohortsService {
  // Criar novo Cohort
  static async create(data: CreateCohortsInput) {
    return prisma.cohorts.create({
      data: {
        empresaId: data.empresaId,
        cohortMes: data.cohortMes,
        clientesIniciais: data.clientesIniciais,
        retencaoM0: data.retencaoM0 ?? 100.00,
        retencaoM1: data.retencaoM1,
        retencaoM2: data.retencaoM2,
        retencaoM3: data.retencaoM3,
        retencaoM6: data.retencaoM6,
        retencaoM12: data.retencaoM12,
        ltvMedio: data.ltvMedio,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Buscar todos os Cohorts com filtros opcionais
  static async findMany(params: CohortsQueryParams = {}) {
    const {
      empresaId,
      cohortMes,
      mesInicio,
      mesFim,
      clientesMinimos,
      page = 1,
      limit = 10,
    } = params;

    const where: any = {};

    if (empresaId) {
      where.empresaId = empresaId;
    }

    if (cohortMes) {
      where.cohortMes = new Date(cohortMes);
    }

    if (mesInicio || mesFim) {
      where.cohortMes = {};
      if (mesInicio) {
        where.cohortMes.gte = new Date(mesInicio);
      }
      if (mesFim) {
        where.cohortMes.lte = new Date(mesFim);
      }
    }

    if (clientesMinimos !== undefined) {
      where.clientesIniciais = {
        gte: clientesMinimos,
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.cohorts.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { cohortMes: 'desc' },
          { clientesIniciais: 'desc' },
        ],
        include: {
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              nomeFantasia: true,
            },
          },
        },
      }),
      prisma.cohorts.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // Buscar Cohort por ID
  static async findById(id: string) {
    return prisma.cohorts.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          },
        },
      },
    });
  }

  // Atualizar Cohort
  static async update(id: string, data: UpdateCohortsInput) {
    return prisma.cohorts.update({
      where: { id },
      data: {
        cohortMes: data.cohortMes,
        clientesIniciais: data.clientesIniciais,
        retencaoM0: data.retencaoM0,
        retencaoM1: data.retencaoM1,
        retencaoM2: data.retencaoM2,
        retencaoM3: data.retencaoM3,
        retencaoM6: data.retencaoM6,
        retencaoM12: data.retencaoM12,
        ltvMedio: data.ltvMedio,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Deletar Cohort
  static async delete(id: string) {
    return prisma.cohorts.delete({
      where: { id },
    });
  }

  // Verificar se Cohort existe
  static async exists(id: string) {
    const count = await prisma.cohorts.count({
      where: { id },
    });
    return count > 0;
  }

  // Verificar se já existe um cohort para empresa e mês
  static async existsByEmpresaAndMes(empresaId: string, cohortMes: Date) {
    const count = await prisma.cohorts.count({
      where: {
        empresaId,
        cohortMes,
      },
    });
    return count > 0;
  }

  // Buscar por empresa e mês específico
  static async findByEmpresaAndMes(empresaId: string, cohortMes: Date) {
    return prisma.cohorts.findFirst({
      where: {
        empresaId,
        cohortMes,
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
    });
  }

  // Estatísticas agregadas por empresa
  static async getStatsByEmpresa(empresaId: string) {
    const stats = await prisma.cohorts.aggregate({
      where: { empresaId },
      _sum: {
        clientesIniciais: true,
      },
      _avg: {
        retencaoM1: true,
        retencaoM3: true,
        retencaoM6: true,
        retencaoM12: true,
        ltvMedio: true,
      },
      _count: {
        id: true,
      },
    });

    return stats;
  }

  // Análise de retenção por empresa
  static async getRetentionAnalysis(empresaId: string) {
    const cohorts = await prisma.cohorts.findMany({
      where: { empresaId },
      orderBy: { cohortMes: 'asc' },
      select: {
        cohortMes: true,
        clientesIniciais: true,
        retencaoM0: true,
        retencaoM1: true,
        retencaoM2: true,
        retencaoM3: true,
        retencaoM6: true,
        retencaoM12: true,
        ltvMedio: true,
      },
    });

    return cohorts;
  }
}