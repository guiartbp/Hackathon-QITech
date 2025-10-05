import { prisma } from "@/lib/prisma";
import { ScoreFeatureInput } from "../../schemas/score-features";

export const ScoreFeatureService = {
  listar: async () => {
    return prisma.scoreFeature.findMany({
      include: {
        scoreCategoria: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.scoreFeature.findUnique({
      where: { id },
      include: {
        scoreCategoria: true,
      },
    });
  },

  criar: async (dados: ScoreFeatureInput) => {
    const { scoreCategoriaId, ...resto } = dados;

    return prisma.scoreFeature.create({
      data: {
        ...resto,
        scoreCategoria: {
          connect: { id: scoreCategoriaId },
        },
      },
      include: {
        scoreCategoria: true,
      },
    });
  },

  atualizar: async (id: string, dados: ScoreFeatureInput) => {
    const { scoreCategoriaId, ...resto } = dados;

    return prisma.scoreFeature.update({
      where: { id },
      data: {
        ...resto,
        scoreCategoria: {
          connect: { id: scoreCategoriaId },
        },
      },
      include: {
        scoreCategoria: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.scoreFeature.delete({ where: { id } });
  },
};