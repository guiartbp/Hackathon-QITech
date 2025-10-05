import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/(backend)/services/db";
import { blockForbiddenRequests } from "@/utils/api";
import { AllowedRoutes } from "@/types";
import { z } from "zod";

const allowedRoles: AllowedRoutes = {
  POST: ["INVESTIDOR", "ADMIN", "SUPER_ADMIN"]
}

const withdrawalSchema = z.object({
  amount: z.number().positive("Valor deve ser positivo"),
  bankAccountId: z.string().optional(),
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
    const validation = withdrawalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { amount, bankAccountId, description } = validation.data;
    const uidUsuario = session.user.id;

    // Find wallet
    const wallet = await prisma.wallet.findUnique({
      where: { uidUsuario }
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Carteira não encontrada" },
        { status: 404 }
      );
    }

    // Check if user has sufficient funds
    if (Number(wallet.disponivelSaque) < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente para saque" },
        { status: 400 }
      );
    }

    // Get user's bank account if not provided
    let selectedBankAccount = null;
    if (bankAccountId) {
      selectedBankAccount = await prisma.dadosBancarios.findFirst({
        where: {
          id: bankAccountId,
          usuarioId: uidUsuario
        }
      });
    } else {
      // Get primary bank account
      selectedBankAccount = await prisma.dadosBancarios.findFirst({
        where: {
          usuarioId: uidUsuario,
          isPrincipal: true
        }
      });
    }

    if (!selectedBankAccount) {
      return NextResponse.json(
        { error: "Conta bancária não encontrada. Configure seus dados bancários primeiro." },
        { status: 400 }
      );
    }

    // Create withdrawal transaction and update wallet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create withdrawal transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          carteiraId: wallet.id,
          uidUsuario,
          tipo: "WITHDRAWAL",
          valor: -amount, // Negative amount for withdrawal
          descricao: description || `Saque de R$ ${amount.toFixed(2)}`,
          status: "PENDING",
          referencia: `WITHDRAWAL_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          metadata: {
            method: "BANK_TRANSFER",
            bankAccountId: selectedBankAccount?.id,
            bankInfo: {
              banco: selectedBankAccount?.banco,
              agencia: selectedBankAccount?.agencia,
              conta: selectedBankAccount?.conta,
              tipoConta: selectedBankAccount?.tipoConta
            },
            originalAmount: amount,
            requestedBy: uidUsuario
          }
        }
      });

      // Update wallet - remove from available balance and add to blocked
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          disponivelSaque: { decrement: amount },
          valorBloqueado: { increment: amount }
        }
      });

      return transaction;
    });

    // In a real application, you would queue this for processing
    // For demonstration, we'll simulate the processing
    setTimeout(async () => {
      try {
        await prisma.$transaction(async (tx) => {
          // Update transaction status (simulate approval/processing)
          await tx.walletTransaction.update({
            where: { id: result.id },
            data: {
              status: "COMPLETED",
              processadoEm: new Date()
            }
          });

          // Update wallet - remove blocked amount and actual balance
          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              saldoAtual: { decrement: amount },
              valorBloqueado: { decrement: amount }
            }
          });
        });
      } catch (error) {
        console.error("Error processing withdrawal:", error);
        // In case of error, revert the blocked amount
        await prisma.$transaction(async (tx) => {
          await tx.walletTransaction.update({
            where: { id: result.id },
            data: { status: "FAILED" }
          });

          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              disponivelSaque: { increment: amount },
              valorBloqueado: { decrement: amount }
            }
          });
        });
      }
    }, 5000); // 5 second delay for simulation

    return NextResponse.json({
      success: true,
      transaction: {
        id: result.id,
        type: result.tipo,
        amount: Number(result.valor),
        status: result.status,
        reference: result.referencia,
        description: result.descricao,
        createdAt: result.criadoEm.toISOString()
      },
      message: "Solicitação de saque criada com sucesso",
      estimatedProcessingTime: "1-2 dias úteis"
    });

  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}