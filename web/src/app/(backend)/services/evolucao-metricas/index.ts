import { prisma } from "@/lib/prisma";
import { EvolucaoMetricasInput } from "../schemas/evolucao-metricas";

export const EvolucaoMetricasService = {
  listar: async () => {
    return prisma.evolucaoMetricas.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.evolucaoMetricas.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: EvolucaoMetricasInput) => {
    const { empresaId, dataReferencia, ...resto } = dados;

    return prisma.evolucaoMetricas.create({
      data: {
        ...resto,
        dataReferencia: new Date(dataReferencia),
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: EvolucaoMetricasInput) => {
    const { empresaId, dataReferencia, ...resto } = dados;

    return prisma.evolucaoMetricas.update({
      where: { id },
      data: {
        ...resto,
        dataReferencia: new Date(dataReferencia),
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
    return prisma.evolucaoMetricas.delete({ where: { id } });
  },
};