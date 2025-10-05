import { prisma } from "@/lib/prisma";
import { MetricasTempoRealInput } from "../schemas/metricas-tempo-real";

export const MetricasTempoRealService = {
  listar: async () => {
    return prisma.metricasTempoReal.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.metricasTempoReal.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: MetricasTempoRealInput) => {
    const { empresaId, timestampCaptura, ...resto } = dados;

    return prisma.metricasTempoReal.create({
      data: {
        ...resto,
        timestampCaptura: timestampCaptura ? new Date(timestampCaptura) : new Date(),
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: MetricasTempoRealInput) => {
    const { empresaId, timestampCaptura, ...resto } = dados;

    return prisma.metricasTempoReal.update({
      where: { id },
      data: {
        ...resto,
        timestampCaptura: timestampCaptura ? new Date(timestampCaptura) : undefined,
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.metricasTempoReal.delete({ where: { id } });
  },
};