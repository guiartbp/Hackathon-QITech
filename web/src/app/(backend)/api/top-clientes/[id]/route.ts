import { NextResponse } from 'next/server';
import { TopClientesService } from '@/app/(backend)/services/top-clientes';
import { updateTopClientesSchema } from '@/app/(backend)/schemas/top-clientes';
import { ZodError } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/top-clientes/[id] - Buscar top cliente por ID
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

    const topClientes = await TopClientesService.findById(id);

    if (!topClientes) {
      return NextResponse.json(
        {
          success: false,
          error: 'Top cliente não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topClientes,
    });
  } catch (error) {
    console.error('Erro ao buscar top cliente:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

// PUT /api/top-clientes/[id] - Atualizar top cliente
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

    // Verificar se o top cliente existe
    const exists = await TopClientesService.exists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Top cliente não encontrado',
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Converter string de data para Date object se necessário
    if (body.mesReferencia && typeof body.mesReferencia === 'string') {
      body.mesReferencia = new Date(body.mesReferencia);
    }

    // Validar dados de entrada
    const validatedData = updateTopClientesSchema.parse(body);

    const updatedTopClientes = await TopClientesService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedTopClientes,
      message: 'Top cliente atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar top cliente:', error);

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
          error: 'Já existe um registro com esses dados',
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

// DELETE /api/top-clientes/[id] - Deletar top cliente
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

    // Verificar se o top cliente existe
    const exists = await TopClientesService.exists(id);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Top cliente não encontrado',
        },
        { status: 404 }
      );
    }

    await TopClientesService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Top cliente deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar top cliente:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}