import { NextRequest, NextResponse } from 'next/server'
import { scoreService } from '../../../services/score'
import { updateScoreSchema, scoreParamsSchema } from '../../../schemas/score'
import { z } from 'zod'

interface RouteContext {
  params: {
    id: string
  }
}

// GET /api/scores/[id] - Buscar score por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreParamsSchema.parse(context.params)

    const score = await scoreService.findById(id)

    if (!score) {
      return NextResponse.json(
        { error: 'Score não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(score)
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

    console.error('Erro ao buscar score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/scores/[id] - Atualizar score
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreParamsSchema.parse(context.params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateScoreSchema.parse(body)

    const score = await scoreService.update(id, validatedData)

    return NextResponse.json(score)
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
      if (error.message === 'Score não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao atualizar score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/scores/[id] - Deletar score
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreParamsSchema.parse(context.params)

    const score = await scoreService.delete(id)

    return NextResponse.json(score)
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
      if (error.message === 'Score não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao deletar score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}