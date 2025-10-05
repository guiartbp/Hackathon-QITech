import { prisma } from "@/lib/prisma";
import { ContratoInput } from "../../schemas/contratos";

export const ContratoService = {
  listar: async () => {
    return prisma.contrato.findMany({
      include: {
        empresa: true,
        proposta: true,
        investimentos: true,
        pagamentos: true,
        projecoesPagamento: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.contrato.findUnique({
      where: { id },
      include: {
        empresa: true,
        proposta: true,
        investimentos: true,
        pagamentos: true,
        projecoesPagamento: true,
      },
    });
  },

  criar: async (dados: ContratoInput) => {
    const { empresaId, propostaId, ...resto } = dados;

    return prisma.contrato.create({
      data: {
        ...resto,
        empresa: {
          connect: { id: empresaId },
        },
        proposta: {
          connect: { id: propostaId },
        },
      },
      include: {
        empresa: true,
        proposta: true,
        investimentos: true,
        pagamentos: true,
        projecoesPagamento: true,
      },
    });
  },

  atualizar: async (id: string, dados: ContratoInput) => {
    const { empresaId, propostaId, ...resto } = dados;

    return prisma.contrato.update({
      where: { id },
      data: {
        ...resto,
        empresa: {
          connect: { id: empresaId },
        },
        proposta: {
          connect: { id: propostaId },
        },
      },
      include: {
        empresa: true,
        proposta: true,
        investimentos: true,
        pagamentos: true,
        projecoesPagamento: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.contrato.delete({ where: { id } });
  },
};