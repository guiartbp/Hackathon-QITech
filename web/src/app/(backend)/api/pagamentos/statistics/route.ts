import { NextRequest, NextResponse } from "next/server";
import { PagamentoService } from "../../../services/pagamento";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contratoId = searchParams.get("contratoId") || undefined;

    const statistics = await PagamentoService.getStatistics(contratoId);

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de pagamentos:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}