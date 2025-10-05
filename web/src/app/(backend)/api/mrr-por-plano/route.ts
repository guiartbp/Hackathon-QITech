import { NextRequest, NextResponse } from 'next/server';
import { mrrPorPlanoService } from '@/app/(backend)/services/mrrPorPlano';
import { CreateMrrPorPlanoSchema, QueryMrrPorPlanoSchema } from '@/app/(backend)/schemas/mrrPorPlano';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = {
      empresaId: searchParams.get('empresaId') || undefined,
      mesReferencia: searchParams.get('mesReferencia') || undefined,
      nomePlano: searchParams.get('nomePlano') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      orderBy: searchParams.get('orderBy') || 'mesReferencia',
      orderDirection: searchParams.get('orderDirection') || 'desc',
    };

    const validatedQuery = QueryMrrPorPlanoSchema.parse(queryParams);
    const result = await mrrPorPlanoService.findMany(validatedQuery);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro na rota GET /mrr-por-plano:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Parâmetros de consulta inválidos',
          details: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateMrrPorPlanoSchema.parse(body);
    
    const mrrPorPlano = await mrrPorPlanoService.create(validatedData);
    
    return NextResponse.json(mrrPorPlano, { status: 201 });
  } catch (error) {
    console.error('Erro na rota POST /mrr-por-plano:', error);

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