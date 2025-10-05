import { prisma } from "@/lib/prisma";
import { RepasseInput } from "../../schemas/repasses";

export const RepasseService = {
  listar: async () => {
    return prisma.repasse.findMany({
      include: {
        investidor: true,
        investimento: true,
        pagamento: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.repasse.findUnique({
      where: { id },
      include: {
        investidor: true,
        investimento: true,
        pagamento: true,
      },
    });
  },

  criar: async (dados: RepasseInput) => {
    const { pagamentoId, investimentoId, investidorId, ...resto } = dados;

    return prisma.repasse.create({
      data: {
        ...resto,
        pagamento: {
          connect: { id: pagamentoId },
        },
        investimento: {
          connect: { id: investimentoId },
        },
        investidor: {
          connect: { id: investidorId },
        },
      },
      include: {
        investidor: true,
        investimento: true,
        pagamento: true,
      },
    });
  },

  atualizar: async (id: string, dados: RepasseInput) => {
    const { pagamentoId, investimentoId, investidorId, ...resto } = dados;

    return prisma.repasse.update({
      where: { id },
      data: {
        ...resto,
        pagamento: {
          connect: { id: pagamentoId },
        },
        investimento: {
          connect: { id: investimentoId },
        },
        investidor: {
          connect: { id: investidorId },
        },
      },
      include: {
        investidor: true,
        investimento: true,
        pagamento: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.repasse.delete({ where: { id } });
  },
};