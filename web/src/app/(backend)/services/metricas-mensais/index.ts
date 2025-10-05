import { prisma } from "@/lib/prisma";
import { MetricasMensaisInput } from "../../schemas/metricas-mensais";

export const MetricasMensaisService = {
  listar: async () => {
    return prisma.metricasMensais.findMany({
      include: {
        empresa: true,
      },
      orderBy: {
        mesReferencia: 'desc',
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.metricasMensais.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });
  },

  criar: async (dados: MetricasMensaisInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.metricasMensais.create({
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

  atualizar: async (id: string, dados: MetricasMensaisInput) => {
    const { empresaId, mesReferencia, ...resto } = dados;

    return prisma.metricasMensais.update({
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
    return prisma.metricasMensais.delete({ where: { id } });
  },
};