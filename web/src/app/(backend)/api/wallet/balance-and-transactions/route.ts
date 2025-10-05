import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/(backend)/services/db";
import { blockForbiddenRequests } from "@/utils/api";
import { AllowedRoutes } from "@/types";
import type { WalletTransaction } from "@/generated/prisma";

const allowedRoles: AllowedRoutes = {
  GET: ["INVESTIDOR", "ADMIN", "SUPER_ADMIN"]
}

export async function GET(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.GET);
    if (forbidden) {
      return forbidden;
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const uidUsuario = session.user.id;

    // Find or create wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { uidUsuario },
      include: {
        transacoes: {
          orderBy: { criadoEm: 'desc' },
          take: 50 // Limit to last 50 transactions
        }
      }
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          uidUsuario,
          saldoAtual: 0,
          disponivelSaque: 0,
          valorBloqueado: 0
        },
        include: {
          transacoes: true
        }
      });
    }

    // Format response
    const response = {
      balance: {
        currentBalance: Number(wallet.saldoAtual),
        availableForWithdrawal: Number(wallet.disponivelSaque),
        blockedAmount: Number(wallet.valorBloqueado)
      },
      transactions: wallet.transacoes.map((transaction: WalletTransaction) => ({
        id: transaction.id,
        userId: transaction.uidUsuario,
        type: transaction.tipo,
        amount: Number(transaction.valor),
        description: transaction.descricao,
        status: transaction.status,
        reference: transaction.referencia,
        createdAt: transaction.criadoEm.toISOString(),
        processedAt: transaction.processadoEm?.toISOString(),
        metadata: transaction.metadata
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}