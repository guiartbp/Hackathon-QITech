import { NextResponse } from 'next/server';
import { TopClientesService } from '@/app/(backend)/services/top-clientes';
import {
  createTopClientesSchema,
  topClientesQuerySchema,
} from '@/app/(backend)/schemas/top-clientes';
import { ZodError } from 'zod';

// GET /api/top-clientes - Listar todos os top clientes com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    // Validar query parameters
    const validatedQuery = topClientesQuerySchema.parse(queryParams);

    const result = await TopClientesService.findMany(validatedQuery);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Erro ao buscar top clientes:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

// POST /api/top-clientes - Criar novo top cliente
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Converter string de data para Date object se necessário
    if (body.mesReferencia && typeof body.mesReferencia === 'string') {
      body.mesReferencia = new Date(body.mesReferencia);
    }

    // Validar dados de entrada
    const validatedData = createTopClientesSchema.parse(body);

    const topClientes = await TopClientesService.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: topClientes,
        message: 'Top cliente criado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar top cliente:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Erro de constraint única ou foreign key
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Já existe um registro com esses dados',
        },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Empresa não encontrada',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}