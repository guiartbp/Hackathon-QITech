import { NextRequest, NextResponse } from "next/server";
import { ProjecaoPagamentoService } from "../../../services/projecao-pagamento";
import { updateProjecaoPagamentoSchema } from "../../../schemas/projecao-pagamento";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const projecaoPagamento = await ProjecaoPagamentoService.getById(params.id);

    if (!projecaoPagamento) {
      return NextResponse.json(
        { error: "Projeção de pagamento não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: projecaoPagamento });
  } catch (error) {
    console.error("Erro ao buscar projeção de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    
    const validatedData = updateProjecaoPagamentoSchema.parse(body);

    const projecaoPagamento = await ProjecaoPagamentoService.update(
      params.id,
      validatedData
    );

    return NextResponse.json({
      data: projecaoPagamento,
      message: "Projeção de pagamento atualizada com sucesso"
    });
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

    console.error("Erro ao atualizar projeção de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await ProjecaoPagamentoService.delete(params.id);

    return NextResponse.json({
      message: "Projeção de pagamento deletada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar projeção de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}