import { NextRequest, NextResponse } from 'next/server';
import { mrrPorPlanoService } from '@/app/(backend)/services/mrrPorPlano';
import { UpdateMrrPorPlanoSchema } from '@/app/(backend)/schemas/mrrPorPlano';
import { z } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID do MRR por plano é obrigatório' },
        { status: 400 }
      );
    }

    const mrrPorPlano = await mrrPorPlanoService.findById(id);
    
    return NextResponse.json(mrrPorPlano, { status: 200 });
  } catch (error) {
    console.error('Erro na rota GET /mrr-por-plano/[id]:', error);

    if (error instanceof Error && error.message === 'MRR por plano não encontrado') {
      return NextResponse.json(
        { error: 'MRR por plano não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID do MRR por plano é obrigatório' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateMrrPorPlanoSchema.parse(body);
    
    const mrrPorPlano = await mrrPorPlanoService.update(id, validatedData);
    
    return NextResponse.json(mrrPorPlano, { status: 200 });
  } catch (error) {
    console.error('Erro na rota PUT /mrr-por-plano/[id]:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados de entrada inválidos',
          details: error.issues
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'MRR por plano não encontrado') {
        return NextResponse.json(
          { error: 'MRR por plano não encontrado' },
          { status: 404 }
        );
      }

      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Já existe um MRR para este plano nesta empresa e mês de referência' },
          { status: 409 }
        );
      }

      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID do MRR por plano é obrigatório' },
        { status: 400 }
      );
    }

    const result = await mrrPorPlanoService.delete(id);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro na rota DELETE /mrr-por-plano/[id]:', error);

    if (error instanceof Error && error.message === 'MRR por plano não encontrado') {
      return NextResponse.json(
        { error: 'MRR por plano não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}