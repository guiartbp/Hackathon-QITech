import { NextRequest, NextResponse } from 'next/server'
import { scoreFeatureService } from '../../services/score-feature'
import { createScoreFeatureSchema, scoreFeatureQuerySchema } from '../../schemas/score-feature'
import { z } from 'zod'

// GET /api/score-features - Listar features de score com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedQuery = scoreFeatureQuerySchema.parse(queryParams)

    const scoreFeatures = await scoreFeatureService.findMany(validatedQuery)
    const total = await scoreFeatureService.count(validatedQuery)

    return NextResponse.json({
      data: scoreFeatures,
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

    console.error('Erro ao buscar features de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/score-features - Criar nova feature de score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createScoreFeatureSchema.parse(body)

    const scoreFeature = await scoreFeatureService.create(validatedData)

    return NextResponse.json(scoreFeature, { status: 201 })
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
    }

    console.error('Erro ao criar feature de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}