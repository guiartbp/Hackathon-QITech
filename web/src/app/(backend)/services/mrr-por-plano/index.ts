import { prisma } from "@/lib/prisma";
import { MrrPorPlanoInput } from "../schemas/mrr-por-plano";

export const MrrPorPlanoService = {
  listar: async () => {
    return prisma.mrrPorPlano.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.mrrPorPlano.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: MrrPorPlanoInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.mrrPorPlano.create({
      data: {
        ...resto,
        mesReferencia: new Date(mesReferencia),
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: MrrPorPlanoInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.mrrPorPlano.update({
      where: { id },
      data: {
        ...resto,
        mesReferencia: new Date(mesReferencia),
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
    return prisma.mrrPorPlano.delete({ where: { id } });
  },
};