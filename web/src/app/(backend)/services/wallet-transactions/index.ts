import { prisma } from "@/lib/prisma";
import { WalletTransactionInput } from "../../schemas/wallet-transactions";

export const WalletTransactionService = {
  listar: async () => {
    return prisma.walletTransaction.findMany({
      include: {
        carteira: true,
      },
    });
  },

  buscarPorId: async (id: string) => {
    return prisma.walletTransaction.findUnique({
      where: { id },
      include: {
        carteira: true,
      },
    });
  },

  criar: async (dados: WalletTransactionInput) => {
    const { carteiraId, processadoEm, ...resto } = dados;
    return prisma.walletTransaction.create({
      data: {
        ...resto,
        processadoEm: processadoEm ? new Date(processadoEm) : null,
        carteira: {
          connect: { id: carteiraId },
        },
      },
      include: {
        carteira: true,
      },
    });
  },

  atualizar: async (id: string, dados: Partial<WalletTransactionInput>) => {
    const { carteiraId, processadoEm, ...resto } = dados;
    return prisma.walletTransaction.update({
      where: { id },
      data: {
        ...resto,
        processadoEm: processadoEm ? new Date(processadoEm) : undefined,
        ...(carteiraId && {
          carteira: {
            connect: { id: carteiraId },
          },
        }),
      },
      include: {
        carteira: true,
      },
    });
  },

  remover: async (id: string) => {
    return prisma.walletTransaction.delete({ where: { id } });
  },
};