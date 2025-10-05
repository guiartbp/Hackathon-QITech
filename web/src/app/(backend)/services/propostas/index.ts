import { prisma } from "@/lib/prisma";
import { PropostaInput } from "../../schemas/propostas";

export const PropostaService = {
  listar: async () => {
    return prisma.proposta.findMany({
      include: {
        empresa: true,
        investimentos: true,
        contrato: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.proposta.findUnique({
      where: { id },
      include: {
        empresa: true,
        investimentos: true,
        contrato: true,
      },
    });
  },

  criar: async (dados: PropostaInput) => {
    const { empresaId, dataAbertura, dataFechamento, ...resto } = dados;
    return prisma.proposta.create({
      data: {
        ...resto,
        dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
        dataFechamento: dataFechamento ? new Date(dataFechamento) : null,
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
        investimentos: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<PropostaInput>) => {
    const { empresaId, dataAbertura, dataFechamento, ...resto } = dados;
    return prisma.proposta.update({
      where: { id },
      data: {
        ...resto,
        dataAbertura: dataAbertura ? new Date(dataAbertura) : undefined,
        dataFechamento: dataFechamento ? new Date(dataFechamento) : undefined,
        ...(empresaId && {
          empresa: {
            connect: { id: empresaId },
          },
        }),
      },
      include: {
        empresa: true,
        investimentos: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.proposta.delete({ where: { id } });
  },
};