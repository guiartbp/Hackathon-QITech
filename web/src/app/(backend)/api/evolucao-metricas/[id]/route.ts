import { NextRequest, NextResponse } from "next/server";
import { EvolucaoMetricasService } from "../../../services/evolucao-metricas";
import {
  updateEvolucaoMetricasSchema,
  evolucaoMetricasParamsSchema,
} from "../../../schemas/evolucao-metricas";

// GET /api/evolucao-metricas/[id] - Buscar evolução de métricas por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar parâmetro ID
    const { id } = evolucaoMetricasParamsSchema.parse(params);

    const evolucaoMetricas = await EvolucaoMetricasService.findById(id);

    return NextResponse.json({
      success: true,
      data: evolucaoMetricas,
    });
  } catch (error: any) {
    console.error("Erro ao buscar evolução de métricas:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error.message.includes("não encontrada")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/evolucao-metricas/[id] - Atualizar evolução de métricas
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar parâmetro ID
    const { id } = evolucaoMetricasParamsSchema.parse(params);

    const body = await request.json();

    // Validar dados de entrada
    const validatedData = updateEvolucaoMetricasSchema.parse(body);

    // Verificar se empresa existe (se empresaId foi fornecido)
    if (validatedData.empresaId) {
      await EvolucaoMetricasService.validateEmpresaExists(validatedData.empresaId);
    }

    const evolucaoMetricas = await EvolucaoMetricasService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: evolucaoMetricas,
      message: "Evolução de métricas atualizada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao atualizar evolução de métricas:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Erro de constraint única (empresaId, dataReferencia, tipoPeriodo)
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Já existe uma evolução de métricas para esta empresa, data e tipo de período",
        },
        { status: 409 }
      );
    }

    if (
      error.message.includes("não encontrada") ||
      error.message.includes("Empresa não encontrada")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/evolucao-metricas/[id] - Deletar evolução de métricas
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar parâmetro ID
    const { id } = evolucaoMetricasParamsSchema.parse(params);

    await EvolucaoMetricasService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Evolução de métricas deletada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao deletar evolução de métricas:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error.message.includes("não encontrada")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error.message,
      },
      { status: 500 }
    );
  }
}