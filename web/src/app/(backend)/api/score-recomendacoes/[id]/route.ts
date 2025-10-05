import { NextRequest, NextResponse } from 'next/server'
import { scoreRecomendacaoService } from '../../../services/score-recomendacao'
import { updateScoreRecomendacaoSchema, scoreRecomendacaoParamsSchema } from '../../../schemas/score-recomendacao'
import { z } from 'zod'

interface RouteContext {
  params: {
    id: string
  }
}

// GET /api/score-recomendacoes/[id] - Buscar recomendação de score por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreRecomendacaoParamsSchema.parse(context.params)

    const scoreRecomendacao = await scoreRecomendacaoService.findById(id)

    if (!scoreRecomendacao) {
      return NextResponse.json(
        { error: 'Recomendação de score não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(scoreRecomendacao)
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

    console.error('Erro ao buscar recomendação de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/score-recomendacoes/[id] - Atualizar recomendação de score
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreRecomendacaoParamsSchema.parse(context.params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateScoreRecomendacaoSchema.parse(body)

    const scoreRecomendacao = await scoreRecomendacaoService.update(id, validatedData)

    return NextResponse.json(scoreRecomendacao)
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
      if (error.message === 'Recomendação de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao atualizar recomendação de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/score-recomendacoes/[id] - Deletar recomendação de score
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = scoreRecomendacaoParamsSchema.parse(context.params)

    const scoreRecomendacao = await scoreRecomendacaoService.delete(id)

    return NextResponse.json(scoreRecomendacao)
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
      if (error.message === 'Recomendação de score não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao deletar recomendação de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}