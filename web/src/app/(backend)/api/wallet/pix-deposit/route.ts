import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/(backend)/services/db";
import { blockForbiddenRequests } from "@/utils/api";
import { AllowedRoutes } from "@/types";
import { z } from "zod";

const allowedRoles: AllowedRoutes = {
  POST: ["INVESTIDOR", "ADMIN", "SUPER_ADMIN"]
}

const pixDepositSchema = z.object({
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.POST);
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

    const body = await request.json();
    const validation = pixDepositSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { amount, description } = validation.data;
    const uidUsuario = session.user.id;

    // Find or create wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { uidUsuario }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          uidUsuario,
          saldoAtual: 0,
          disponivelSaque: 0,
          valorBloqueado: 0
        }
      });
    }

    // Create PIX deposit transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        carteiraId: wallet.id,
        uidUsuario,
        tipo: "PIX_DEPOSIT",
        valor: amount,
        descricao: description || `Depósito PIX de R$ ${amount.toFixed(2)}`,
        status: "PENDING",
        referencia: `PIX_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        metadata: {
          method: "PIX",
          originalAmount: amount,
          createdBy: uidUsuario
        }
      }
    });

    // In a real application, you would integrate with a payment processor here
    // For now, we'll simulate immediate completion for demonstration
    // In production, this would be handled by a webhook from the payment processor
    
    // Simulate processing delay (remove in production)
    setTimeout(async () => {
      try {
        await prisma.$transaction(async (tx) => {
          // Update transaction status
          await tx.walletTransaction.update({
            where: { id: transaction.id },
            data: {
              status: "COMPLETED",
              processadoEm: new Date()
            }
          });

          // Update wallet balance
          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              saldoAtual: { increment: amount },
              disponivelSaque: { increment: amount }
            }
          });
        });
      } catch (error) {
        console.error("Error processing PIX deposit:", error);
      }
    }, 2000);

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        type: transaction.tipo,
        amount: Number(transaction.valor),
        status: transaction.status,
        reference: transaction.referencia,
        description: transaction.descricao,
        createdAt: transaction.criadoEm.toISOString()
      },
      message: "Depósito PIX iniciado com sucesso"
    });

  } catch (error) {
    console.error("Error creating PIX deposit:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}