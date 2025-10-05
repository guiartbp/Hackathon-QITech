import { prisma } from "@/lib/prisma";
import { CohortsInput } from "../../schemas/cohorts";

export const CohortsService = {
  listar: async () => {
    return prisma.cohorts.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.cohorts.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: CohortsInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.cohorts.create({
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

  atualizar: async (id: string, dados: CohortsInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.cohorts.update({
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
    return prisma.cohorts.delete({ where: { id } });
  },
};