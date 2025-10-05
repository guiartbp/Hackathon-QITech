import { prisma } from "@/lib/prisma";
import { ScoreCategoriaInput } from "../../schemas/score-categorias";

export const ScoreCategoriaService = {
  listar: async () => {
    return prisma.scoreCategoria.findMany({
      include: {
        score: true,
        features: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.scoreCategoria.findUnique({
      where: { id },
      include: {
        score: true,
        features: true,
      },
    });
  },

  criar: async (dados: ScoreCategoriaInput) => {
    const { scoreId, ...resto } = dados;

    return prisma.scoreCategoria.create({
      data: {
        ...resto,
        score: {
          connect: { id: scoreId },
        },
      },
      include: {
        score: true,
        features: true,
      },
    });
  },

  atualizar: async (id: string, dados: ScoreCategoriaInput) => {
    const { scoreId, ...resto } = dados;

    return prisma.scoreCategoria.update({
      where: { id },
      data: {
        ...resto,
        score: {
          connect: { id: scoreId },
        },
      },
      include: {
        score: true,
        features: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.scoreCategoria.delete({ where: { id } });
  },
};