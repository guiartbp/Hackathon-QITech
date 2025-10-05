import { prisma } from "@/lib/prisma";
import { InvestidorInput } from "../../schemas/investidores";

export const InvestidorService = {
  listar: async () => {
    return prisma.investidor.findMany({
      include: {
        investimentos: true,
        repasses: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.investidor.findUnique({
      where: { id },
      include: {
        investimentos: true,
        repasses: true,
      },
    });
  },

  criar: async (dados: InvestidorInput) => {
    return prisma.investidor.create({
      data: dados,
      include: {
        investimentos: true,
        repasses: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<InvestidorInput>) => {
    return prisma.investidor.update({
      where: { id },
      data: dados,
      include: {
        investimentos: true,
        repasses: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.investidor.delete({ where: { id } });
  },
};