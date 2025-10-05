import { prisma } from "@/lib/prisma";
import { PagamentoInput } from "../../schemas/pagamentos";

export const PagamentoService = {
  listar: async () => {
    return prisma.pagamento.findMany({
      include: {
        contrato: true,
        repasses: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.pagamento.findUnique({
      where: { id },
      include: {
        contrato: true,
        repasses: true,
      },
    });
  },

  criar: async (dados: PagamentoInput) => {
    const { contratoId, ...resto } = dados;

    return prisma.pagamento.create({
      data: {
        ...resto,
        contrato: {
          connect: { id: contratoId },
        },
      },
      include: {
        contrato: true,
        repasses: true,
      },
    });
  },

  atualizar: async (id: string, dados: PagamentoInput) => {
    const { contratoId, ...resto } = dados;

    return prisma.pagamento.update({
      where: { id },
      data: {
        ...resto,
        contrato: {
          connect: { id: contratoId },
        },
      },
      include: {
        contrato: true,
        repasses: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.pagamento.delete({ where: { id } });
  },
};