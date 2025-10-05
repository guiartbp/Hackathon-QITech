import { prisma } from "@/lib/prisma";
import { WalletInput } from "../../schemas/wallets";

export const WalletService = {
  listar: async () => {
    return prisma.wallet.findMany({
      include: {
        transacoes: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.wallet.findUnique({
      where: { id },
      include: {
        transacoes: true,
      },
    });
  },

  criar: async (dados: WalletInput) => {
    return prisma.wallet.create({
      data: dados,
      include: {
        transacoes: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<WalletInput>) => {
    return prisma.wallet.update({
      where: { id },
      data: dados,
      include: {
        transacoes: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.wallet.delete({ where: { id } });
  },
};