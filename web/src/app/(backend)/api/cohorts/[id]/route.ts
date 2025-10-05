import { NextResponse } from 'next/server';
import { CohortsService } from '@/app/(backend)/services/cohorts';
import { updateCohortsSchema } from '@/app/(backend)/schemas/cohorts';
import { ZodError } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/cohorts/[id] - Buscar cohort por ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID é obrigatório',
        },
        { status: 400 }
      );
    }

    const cohort = await CohortsService.findById(id);

    if (!cohort) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cohort não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cohort,
    });
  } catch (error) {
    console.error('Erro ao buscar cohort:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

// PUT /api/cohorts/[id] - Atualizar cohort
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID é obrigatório',
        },
        { status: 400 }
      );
    }

    // Verificar se o cohort existe
    const exists = await CohortsService.exists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cohort não encontrado',
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Converter string de data para Date object se necessário
    if (body.cohortMes && typeof body.cohortMes === 'string') {
      body.cohortMes = new Date(body.cohortMes);
    }

    // Validar dados de entrada
    const validatedData = updateCohortsSchema.parse(body);

    const updatedCohort = await CohortsService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedCohort,
      message: 'Cohort atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar cohort:', error);

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

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cohorts/[id] - Deletar cohort
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID é obrigatório',
        },
        { status: 400 }
      );
    }

    // Verificar se o cohort existe
    const exists = await CohortsService.exists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cohort não encontrado',
        },
        { status: 404 }
      );
    }

    await CohortsService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Cohort deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar cohort:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}