import { prisma } from "@/lib/prisma";
import { ProjecaoPagamentoInput } from "../../schemas/projecoes-pagamento";

export const ProjecaoPagamentoService = {
  listar: async () => {
    return prisma.projecaoPagamento.findMany({
      include: {
        contrato: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.projecaoPagamento.findUnique({
      where: { id },
      include: {
        contrato: true,
      },
    });
  },

  criar: async (dados: ProjecaoPagamentoInput) => {
    const { contratoId, ...resto } = dados;

    return prisma.projecaoPagamento.create({
      data: {
        ...resto,
        contrato: {
          connect: { id: contratoId },
        },
      },
      include: {
        contrato: true,
      },
    });
  },

  atualizar: async (id: string, dados: ProjecaoPagamentoInput) => {
    const { contratoId, ...resto } = dados;

    return prisma.projecaoPagamento.update({
      where: { id },
      data: {
        ...resto,
        contrato: {
          connect: { id: contratoId },
        },
      },
      include: {
        contrato: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.projecaoPagamento.delete({ where: { id } });
  },
};