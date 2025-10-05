import { NextRequest, NextResponse } from 'next/server'
import { scoreRecomendacaoService } from '../../services/score-recomendacao'
import { createScoreRecomendacaoSchema, scoreRecomendacaoQuerySchema } from '../../schemas/score-recomendacao'
import { z } from 'zod'

// GET /api/score-recomendacoes - Listar recomendações de score com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedQuery = scoreRecomendacaoQuerySchema.parse(queryParams)

    const scoreRecomendacoes = await scoreRecomendacaoService.findMany(validatedQuery)
    const total = await scoreRecomendacaoService.count(validatedQuery)

    return NextResponse.json({
      data: scoreRecomendacoes,
      pagination: {
        total,
        limit: validatedQuery.limit || 50,
        offset: validatedQuery.offset || 0,
        hasNext: ((validatedQuery.offset || 0) + (validatedQuery.limit || 50)) < total,
        hasPrev: (validatedQuery.offset || 0) > 0,
      },
    })
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

    console.error('Erro ao buscar recomendações de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/score-recomendacoes - Criar nova recomendação de score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createScoreRecomendacaoSchema.parse(body)

    const scoreRecomendacao = await scoreRecomendacaoService.create(validatedData)

    return NextResponse.json(scoreRecomendacao, { status: 201 })
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

    console.error('Erro ao criar recomendação de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}