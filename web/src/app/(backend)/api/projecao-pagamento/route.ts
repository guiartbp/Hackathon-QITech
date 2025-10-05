import { NextRequest, NextResponse } from "next/server";
import { ProjecaoPagamentoService } from "../../services/projecao-pagamento";
import { createProjecaoPagamentoSchema } from "../../schemas/projecao-pagamento";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      contratoId: searchParams.get("contratoId") || undefined,
      mesReferencia: searchParams.get("mesReferencia") 
        ? new Date(searchParams.get("mesReferencia")!) 
        : undefined,
    };

    const projecoesPagamento = await ProjecaoPagamentoService.getAll(filters);

    return NextResponse.json({
      data: projecoesPagamento,
      total: projecoesPagamento.length,
    });
  } catch (error) {
    console.error("Erro ao buscar projeções de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = createProjecaoPagamentoSchema.parse(body);

    const projecaoPagamento = await ProjecaoPagamentoService.create(validatedData);

    return NextResponse.json(
      { 
        data: projecaoPagamento,
        message: "Projeção de pagamento criada com sucesso"
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: error.issues
        },
        { status: 400 }
      );
    }

    console.error("Erro ao criar projeção de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}