import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verificar se já existe uma wallet para este usuário
    const existingWallet = await prisma.wallet.findUnique({
      where: { uidUsuario: userId }
    });

    if (existingWallet) {
      return Response.json({
        success: true,
        wallet: existingWallet,
        message: "Carteira já existe"
      });
    }

    // Criar nova wallet com saldo 0
    const wallet = await prisma.wallet.create({
      data: {
        uidUsuario: userId,
        saldoAtual: 0,
        disponivelSaque: 0,
        valorBloqueado: 0,
      }
    });

    return Response.json({
      success: true,
      wallet,
      message: "Carteira criada com sucesso"
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar wallet:', error);
    return Response.json({ 
      erro: "Erro ao criar carteira",
      success: false 
    }, { status: 500 });
  }
}
