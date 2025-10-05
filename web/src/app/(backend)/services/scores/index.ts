import { prisma } from "@/lib/prisma";
import { ScoreInput } from "../../schemas/scores";

export const ScoreService = {
  listar: async () => {
    return prisma.score.findMany({
      include: {
        empresa: true,
        categorias: true,
        recomendacoes: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.score.findUnique({
      where: { id },
      include: {
        empresa: true,
        categorias: true,
        recomendacoes: true,
      },
    });
  },

  criar: async (dados: ScoreInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.score.create({
      data: {
        ...resto,
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
        categorias: true,
        recomendacoes: true,
      },
    });
  },

  atualizar: async (id: string, dados: ScoreInput) => {
    const { empresaId, ...resto } = dados;

    return prisma.score.update({
      where: { id },
      data: {
        ...resto,
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
        categorias: true,
        recomendacoes: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.score.delete({ where: { id } });
  },
};