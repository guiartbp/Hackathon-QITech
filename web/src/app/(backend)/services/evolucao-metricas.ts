import { PrismaClient } from "@/generated/prisma";
import type {
  CreateEvolucaoMetricasInput,
  UpdateEvolucaoMetricasInput,
  ListEvolucaoMetricasQuery,
} from "../schemas/evolucao-metricas";

const prisma = new PrismaClient();

export class EvolucaoMetricasService {
  // Criar nova evolução de métricas
  static async create(data: CreateEvolucaoMetricasInput) {
    return prisma.evolucaoMetricas.create({
      data: {
        empresaId: data.empresaId,
        dataReferencia: data.dataReferencia,
        tipoPeriodo: data.tipoPeriodo,
        arr: data.arr,
        mrr: data.mrr,
        numClientes: data.numClientes,
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

  // Buscar todas as evoluções de métricas com filtros
  static async findMany(query: ListEvolucaoMetricasQuery) {
    const {
      empresaId,
      tipoPeriodo,
      dataInicio,
      dataFim,
      page,
      limit,
      orderBy,
      orderDir,
    } = query;

    const skip = (page - 1) * limit;

    // Construir filtros where
    const where: any = {};

    if (empresaId) {
      where.empresaId = empresaId;
    }

    if (tipoPeriodo) {
      where.tipoPeriodo = tipoPeriodo;
    }

    if (dataInicio || dataFim) {
      where.dataReferencia = {};
      if (dataInicio) {
        where.dataReferencia.gte = dataInicio;
      }
      if (dataFim) {
        where.dataReferencia.lte = dataFim;
      }
    }

    // Buscar dados e contar total
    const [data, total] = await Promise.all([
      prisma.evolucaoMetricas.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: orderDir,
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
      }),
      prisma.evolucaoMetricas.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar evolução de métricas por ID
  static async findById(id: string) {
    const evolucaoMetricas = await prisma.evolucaoMetricas.findUnique({
      where: { id },
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

    if (!evolucaoMetricas) {
      throw new Error("Evolução de métricas não encontrada");
    }

    return evolucaoMetricas;
  }

  // Atualizar evolução de métricas
  static async update(id: string, data: UpdateEvolucaoMetricasInput) {
    // Verificar se existe
    await this.findById(id);

    return prisma.evolucaoMetricas.update({
      where: { id },
      data: {
        empresaId: data.empresaId,
        dataReferencia: data.dataReferencia,
        tipoPeriodo: data.tipoPeriodo,
        arr: data.arr,
        mrr: data.mrr,
        numClientes: data.numClientes,
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

  // Deletar evolução de métricas
  static async delete(id: string) {
    // Verificar se existe
    await this.findById(id);

    return prisma.evolucaoMetricas.delete({
      where: { id },
    });
  }

  // Verificar se empresa existe (usado nas validações)
  static async validateEmpresaExists(empresaId: string) {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { id: true },
    });

    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }

    return true;
  }
}