import { prisma } from "@/lib/prisma";
import { EmpresaInput } from "../../schemas/empresas";

export const EmpresaService = {
  listar: async () => {
    return prisma.empresa.findMany({
      include: {
        tomador: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.empresa.findUnique({
      where: { id },
      include: {
        tomador: true,
        propostas: true,
        contratos: true,
        scores: true,
      },
    });
  },

  criar: async (dados: EmpresaInput) => {
    const { tomadorId, dataFundacao, ...resto } = dados;
    return prisma.empresa.create({
      data: {
        ...resto,
        dataFundacao: dataFundacao ? new Date(dataFundacao) : null,
        tomador: {
          connect: { id: tomadorId },
        },
      },
      include: {
        tomador: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<EmpresaInput>) => {
    const { tomadorId, dataFundacao, ...resto } = dados;
    return prisma.empresa.update({
      where: { id },
      data: {
        ...resto,
        dataFundacao: dataFundacao ? new Date(dataFundacao) : undefined,
        ...(tomadorId && {
          tomador: {
            connect: { id: tomadorId },
          },
        }),
      },
      include: {
        tomador: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.empresa.delete({ where: { id } });
  },
};