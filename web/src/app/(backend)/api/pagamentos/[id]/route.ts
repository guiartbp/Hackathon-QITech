import { NextRequest, NextResponse } from "next/server";
import { PagamentoService } from "../../../services/pagamento";
import { updatePagamentoSchema } from "../../../schemas/pagamento";
import { ZodError } from "zod";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do pagamento é obrigatório" },
        { status: 400 }
      );
    }

    const pagamento = await PagamentoService.findById(id);

    return NextResponse.json(pagamento, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);

    if (error instanceof Error && error.message === "Pagamento não encontrado") {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do pagamento é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updatePagamentoSchema.parse(body);

    const pagamento = await PagamentoService.update(id, validatedData);

    return NextResponse.json(pagamento, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Pagamento não encontrado") {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do pagamento é obrigatório" },
        { status: 400 }
      );
    }

    const result = await PagamentoService.delete(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir pagamento:", error);

    if (error instanceof Error && error.message === "Pagamento não encontrado") {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes("repasses associados")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
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