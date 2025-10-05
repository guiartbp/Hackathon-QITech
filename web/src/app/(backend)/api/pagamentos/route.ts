import { NextRequest, NextResponse } from "next/server";
import { PagamentoService } from "../../services/pagamento";
import {
  createPagamentoSchema,
  pagamentoQuerySchema,
} from "../../schemas/pagamento";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = {
      contratoId: searchParams.get("contratoId") || undefined,
      status: searchParams.get("status") || undefined,
      tipoPagamento: searchParams.get("tipoPagamento") || undefined,
      dataVencimentoInicio: searchParams.get("dataVencimentoInicio") || undefined,
      dataVencimentoFim: searchParams.get("dataVencimentoFim") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const validatedQuery = pagamentoQuerySchema.parse(queryParams);
    const result = await PagamentoService.findMany(validatedQuery);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPagamentoSchema.parse(body);

    const pagamento = await PagamentoService.create(validatedData);

    return NextResponse.json(pagamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}