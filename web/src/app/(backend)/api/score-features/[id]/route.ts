import { NextRequest, NextResponse } from 'next/server'
import { scoreFeatureService } from '../../../services/score-feature'
import { updateScoreFeatureSchema, scoreFeatureParamsSchema } from '../../../schemas/score-feature'
import { z } from 'zod'

interface RouteContext {
  params: {
    id: string
  }
}

// GET /api/score-features/[id] - Buscar feature de score por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreFeatureParamsSchema.parse(context.params)

    const scoreFeature = await scoreFeatureService.findById(id)

    if (!scoreFeature) {
      return NextResponse.json(
        { error: 'Feature de score não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(scoreFeature)
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

    console.error('Erro ao buscar feature de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/score-features/[id] - Atualizar feature de score
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreFeatureParamsSchema.parse(context.params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateScoreFeatureSchema.parse(body)

    const scoreFeature = await scoreFeatureService.update(id, validatedData)

    return NextResponse.json(scoreFeature)
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
      if (error.message === 'Feature de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao atualizar feature de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/score-features/[id] - Deletar feature de score
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreFeatureParamsSchema.parse(context.params)

    const scoreFeature = await scoreFeatureService.delete(id)

    return NextResponse.json(scoreFeature)
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
      if (error.message === 'Feature de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao deletar feature de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}