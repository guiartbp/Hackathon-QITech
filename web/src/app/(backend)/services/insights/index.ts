import { prisma } from "@/lib/prisma";
import { InsightInput } from "../../schemas/insights";

export const InsightService = {
  listar: async () => {
    return prisma.insight.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.insight.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: InsightInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.insight.create({
      data: {
        ...resto,
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: InsightInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.insight.update({
      where: { id },
      data: {
        ...resto,
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
    return prisma.insight.delete({ where: { id } });
  },
};