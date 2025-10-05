import { prisma } from "@/lib/prisma";
import { InvestimentoInput } from "../../schemas/investimentos";

export const InvestimentoService = {
  listar: async () => {
    return prisma.investimento.findMany({
      include: {
        contrato: true,
        investidor: true,
        proposta: true,
        repasses: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.investimento.findUnique({
      where: { id },
      include: {
        contrato: true,
        investidor: true,
        proposta: true,
        repasses: true,
      },
    });
  },

  criar: async (dados: InvestimentoInput) => {
    const { contratoId, investidorId, propostaId, ...resto } = dados;

    return prisma.investimento.create({
      data: {
        ...resto,
        ...(contratoId && {
          contrato: {
            connect: { id: contratoId },
          },
        }),
        investidor: {
          connect: { id: investidorId },
        },
        ...(propostaId && {
          proposta: {
            connect: { id: propostaId },
          },
        }),
      },
      include: {
        contrato: true,
        investidor: true,
        proposta: true,
        repasses: true,
      },
    });
  },

  atualizar: async (id: string, dados: InvestimentoInput) => {
    const { contratoId, investidorId, propostaId, ...resto } = dados;

    return prisma.investimento.update({
      where: { id },
      data: {
        ...resto,
        ...(contratoId && {
          contrato: {
            connect: { id: contratoId },
          },
        }),
        investidor: {
          connect: { id: investidorId },
        },
        ...(propostaId && {
          proposta: {
            connect: { id: propostaId },
          },
        }),
      },
      include: {
        contrato: true,
        investidor: true,
        proposta: true,
        repasses: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.investimento.delete({ where: { id } });
  },
};