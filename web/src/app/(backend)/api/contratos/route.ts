import { NextRequest, NextResponse } from "next/server";
import { ContratoService } from "../../services/contratoService";
import { createContratoSchema, contratoQuerySchema } from "../../schemas/contrato";

const contratoService = new ContratoService();

// GET /api/contratos - Buscar todos os contratos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = Object.fromEntries(searchParams);
    const validatedParams = contratoQuerySchema.parse(queryParams);

    const result = await contratoService.getAllContratos(validatedParams);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    
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

// POST /api/contratos - Criar novo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createContratoSchema.parse(body);

    const contrato = await contratoService.createContrato(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: contrato,
        message: "Contrato criado com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar contrato:", error);

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