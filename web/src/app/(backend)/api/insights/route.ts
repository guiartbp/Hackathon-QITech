import { NextRequest, NextResponse } from 'next/server'
import { insightService } from '../../services/insight'
import { createInsightSchema, insightQuerySchema } from '../../schemas/insight'
import { z } from 'zod'

// GET /api/insights - Listar insights com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedQuery = insightQuerySchema.parse(queryParams)

    const insights = await insightService.findMany(validatedQuery)
    const total = await insightService.count(validatedQuery)

    return NextResponse.json({
      data: insights,
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

    console.error('Erro ao buscar insights:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/insights - Criar novo insight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createInsightSchema.parse(body)

    const insight = await insightService.create(validatedData)

    return NextResponse.json(insight, { status: 201 })
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

    console.error('Erro ao criar insight:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}