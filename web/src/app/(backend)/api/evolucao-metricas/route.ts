import { NextRequest, NextResponse } from "next/server";
import { EvolucaoMetricasService } from "../../services/evolucao-metricas";
import {
  createEvolucaoMetricasSchema,
  listEvolucaoMetricasSchema,
} from "../../schemas/evolucao-metricas";

// GET /api/evolucao-metricas - Listar evoluções de métricas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = {
      empresaId: searchParams.get("empresaId") || undefined,
      tipoPeriodo: searchParams.get("tipoPeriodo") || undefined,
      dataInicio: searchParams.get("dataInicio") || undefined,
      dataFim: searchParams.get("dataFim") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      orderBy: searchParams.get("orderBy") || "dataReferencia",
      orderDir: searchParams.get("orderDir") || "desc",
    };

    // Validar query parameters
    const validatedQuery = listEvolucaoMetricasSchema.parse(queryParams);

    const result = await EvolucaoMetricasService.findMany(validatedQuery);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erro ao buscar evoluções de métricas:", error);

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

// POST /api/evolucao-metricas - Criar nova evolução de métricas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validatedData = createEvolucaoMetricasSchema.parse(body);

    // Verificar se empresa existe
    await EvolucaoMetricasService.validateEmpresaExists(validatedData.empresaId);

    const evolucaoMetricas = await EvolucaoMetricasService.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: evolucaoMetricas,
        message: "Evolução de métricas criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao criar evolução de métricas:", error);

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

    // Empresa não encontrada
    if (error.message.includes("Empresa não encontrada")) {
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