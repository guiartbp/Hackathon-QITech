import { prisma } from "@/lib/prisma";
import { ScoreRecomendacaoInput } from "../../schemas/score-recomendacoes";

export const ScoreRecomendacaoService = {
  listar: async () => {
    return prisma.scoreRecomendacao.findMany({
      include: {
        score: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.scoreRecomendacao.findUnique({
      where: { id },
      include: {
        score: true,
      },
    });
  },

  criar: async (dados: ScoreRecomendacaoInput) => {
    const { scoreId, ...resto } = dados;

    return prisma.scoreRecomendacao.create({
      data: {
        ...resto,
        score: {
          connect: { id: scoreId },
        },
      },
      include: {
        score: true,
      },
    });
  },

  atualizar: async (id: string, dados: ScoreRecomendacaoInput) => {
    const { scoreId, ...resto } = dados;

    return prisma.scoreRecomendacao.update({
      where: { id },
      data: {
        ...resto,
        score: {
          connect: { id: scoreId },
        },
      },
      include: {
        score: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.scoreRecomendacao.delete({ where: { id } });
  },
};