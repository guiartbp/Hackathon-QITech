import { NextRequest, NextResponse } from 'next/server'
import { scoreService } from '../../services/score'
import { createScoreSchema, scoreQuerySchema } from '../../schemas/score'
import { z } from 'zod'

// GET /api/scores - Listar scores com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedQuery = scoreQuerySchema.parse(queryParams)

    const scores = await scoreService.findMany(validatedQuery)
    const total = await scoreService.count(validatedQuery)

    return NextResponse.json({
      data: scores,
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

    console.error('Erro ao buscar scores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/scores - Criar novo score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createScoreSchema.parse(body)

    const score = await scoreService.create(validatedData)

    return NextResponse.json(score, { status: 201 })
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
      if (error.message === 'Empresa não encontrada') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao criar score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}