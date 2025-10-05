import { NextRequest, NextResponse } from 'next/server'
import { scoreCategoriaService } from '../../../services/score-categoria'
import { updateScoreCategoriaSchema, scoreCategoriaParamsSchema } from '../../../schemas/score-categoria'
import { z } from 'zod'

interface RouteContext {
  params: {
    id: string
  }
}

// GET /api/score-categorias/[id] - Buscar categoria de score por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreCategoriaParamsSchema.parse(context.params)

    const scoreCategoria = await scoreCategoriaService.findById(id)

    if (!scoreCategoria) {
      return NextResponse.json(
        { error: 'Categoria de score não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(scoreCategoria)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Erro ao buscar categoria de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/score-categorias/[id] - Atualizar categoria de score
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreCategoriaParamsSchema.parse(context.params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateScoreCategoriaSchema.parse(body)

    const scoreCategoria = await scoreCategoriaService.update(id, validatedData)

    return NextResponse.json(scoreCategoria)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      if (error.message === 'Categoria de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
      if (error.message === 'Já existe uma categoria com este nome para este score') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        )
      }
    }

    console.error('Erro ao atualizar categoria de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/score-categorias/[id] - Deletar categoria de score
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreCategoriaParamsSchema.parse(context.params)

    const scoreCategoria = await scoreCategoriaService.delete(id)

    return NextResponse.json(scoreCategoria)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      if (error.message === 'Categoria de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao deletar categoria de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}