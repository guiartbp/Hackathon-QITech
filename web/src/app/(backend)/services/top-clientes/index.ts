import { prisma } from "@/lib/prisma";
import { TopClientesInput } from "../schemas/top-clientes";

export const TopClientesService = {
  listar: async () => {
    return prisma.topClientes.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.topClientes.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: TopClientesInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.topClientes.create({
      data: {
        ...resto,
        mesReferencia: new Date(mesReferencia),
        empresa: {
          connect: { id: empresaId },
        },
      },
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: TopClientesInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.topClientes.update({
      where: { id },
      data: {
        ...resto,
        mesReferencia: new Date(mesReferencia),
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
    return prisma.topClientes.delete({ where: { id } });
  },
};