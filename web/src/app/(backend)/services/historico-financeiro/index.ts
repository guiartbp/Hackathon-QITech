import { prisma } from "@/lib/prisma";
import { HistoricoFinanceiroInput } from "../../schemas/historico-financeiro";

export const HistoricoFinanceiroService = {
  listar: async () => {
    return prisma.historicoFinanceiro.findMany({
      include: {
        empresa: true,
      },
      orderBy: {
        periodo: 'desc',
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.historicoFinanceiro.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: HistoricoFinanceiroInput) => {
    const { empresaId, periodo, ...resto } = dados;

    return prisma.historicoFinanceiro.create({
      data: {
        ...resto,
        periodo: new Date(periodo),
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: HistoricoFinanceiroInput) => {
    const { empresaId, periodo, ...resto } = dados;

    return prisma.historicoFinanceiro.update({
      where: { id },
      data: {
        ...resto,
        periodo: new Date(periodo),
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
    return prisma.historicoFinanceiro.delete({ where: { id } });
  },
};