import { NextResponse } from 'next/server';
import { CohortsService } from '@/app/(backend)/services/cohorts';
import {
  createCohortsSchema,
  cohortsQuerySchema,
} from '@/app/(backend)/schemas/cohorts';
import { ZodError } from 'zod';

// GET /api/cohorts - Listar todos os cohorts com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    // Validar query parameters
    const validatedQuery = cohortsQuerySchema.parse(queryParams);

    const result = await CohortsService.findMany(validatedQuery);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Erro ao buscar cohorts:', error);

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

// POST /api/cohorts - Criar novo cohort
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Converter string de data para Date object se necessário
    if (body.cohortMes && typeof body.cohortMes === 'string') {
      body.cohortMes = new Date(body.cohortMes);
    }

    // Validar dados de entrada
    const validatedData = createCohortsSchema.parse(body);

    // Verificar se já existe um cohort para essa empresa e mês
    const exists = await CohortsService.existsByEmpresaAndMes(
      validatedData.empresaId,
      validatedData.cohortMes
    );

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Já existe um cohort para essa empresa e mês',
        },
        { status: 409 }
      );
    }

    const cohort = await CohortsService.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: cohort,
        message: 'Cohort criado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar cohort:', error);

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

    // Erro de constraint única
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Já existe um cohort para essa empresa e mês',
        },
        { status: 409 }
      );
    }

    // Erro de foreign key
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