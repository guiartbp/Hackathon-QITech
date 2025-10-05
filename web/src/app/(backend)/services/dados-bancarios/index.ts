import { prisma } from "@/lib/prisma";
import { DadosBancariosInput } from "../../schemas/dados-bancarios";

export const DadosBancariosService = {
  listar: async () => {
    return prisma.dadosBancarios.findMany();
  },

  buscarPorId: async (id: string) => {
    return prisma.dadosBancarios.findUnique({
      where: { id },
    });
  },

  criar: async (dados: DadosBancariosInput) => {
    const { ultimaValidacao, ...resto } = dados;
    return prisma.dadosBancarios.create({
      data: {
        ...resto,
        ultimaValidacao: ultimaValidacao ? new Date(ultimaValidacao) : null,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<DadosBancariosInput>) => {
    const { ultimaValidacao, ...resto } = dados;
    return prisma.dadosBancarios.update({
      where: { id },
      data: {
        ...resto,
        ultimaValidacao: ultimaValidacao ? new Date(ultimaValidacao) : undefined,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.dadosBancarios.delete({ where: { id } });
  },
};