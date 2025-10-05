import { NextRequest, NextResponse } from "next/server";
import { ContratoService } from "../../../services/contratoService";
import { updateContratoSchema } from "../../../schemas/contrato";

const contratoService = new ContratoService();

// GET /api/contratos/[id] - Buscar contrato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do contrato é obrigatório",
        },
        { status: 400 }
      );
    }

    const contrato = await contratoService.getContratoById(id);

    return NextResponse.json({
      success: true,
      data: contrato,
    });
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return NextResponse.json(
        {
          success: false,
          error: "Contrato não encontrado",
          message: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// PUT /api/contratos/[id] - Atualizar contrato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do contrato é obrigatório",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateContratoSchema.parse(body);

    const contrato = await contratoService.updateContrato(id, validatedData);

    return NextResponse.json({
      success: true,
      data: contrato,
      message: "Contrato atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return NextResponse.json(
        {
          success: false,
          error: "Contrato não encontrado",
          message: error.message,
        },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/contratos/[id] - Deletar contrato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do contrato é obrigatório",
        },
        { status: 400 }
      );
    }

    const result = await contratoService.deleteContrato(id);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Erro ao deletar contrato:", error);

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return NextResponse.json(
        {
          success: false,
          error: "Contrato não encontrado",
          message: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}