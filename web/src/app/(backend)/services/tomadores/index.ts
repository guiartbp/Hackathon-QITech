import { prisma } from "@/lib/prisma";
import { TomadorInput } from "../../schemas/tomadores";

export const TomadorService = {
  listar: async () => {
    return prisma.tomador.findMany({
      include: {
        empresa: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.tomador.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: TomadorInput) => {
    return prisma.tomador.create({
      data: dados,
      include: {
        empresa: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<TomadorInput>) => {
    return prisma.tomador.update({
      where: { id },
      data: dados,
      include: {
        empresa: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.tomador.delete({ where: { id } });
  },
};