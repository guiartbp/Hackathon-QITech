import { NextRequest, NextResponse } from 'next/server'
import { scoreCategoriaService } from '../../services/score-categoria'
import { createScoreCategoriaSchema, scoreCategoriaQuerySchema } from '../../schemas/score-categoria'
import { z } from 'zod'

// GET /api/score-categorias - Listar categorias de score com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedQuery = scoreCategoriaQuerySchema.parse(queryParams)

    const scoreCategories = await scoreCategoriaService.findMany(validatedQuery)
    const total = await scoreCategoriaService.count(validatedQuery)

    return NextResponse.json({
      data: scoreCategories,
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

    console.error('Erro ao buscar categorias de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/score-categorias - Criar nova categoria de score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createScoreCategoriaSchema.parse(body)

    const scoreCategoria = await scoreCategoriaService.create(validatedData)

    return NextResponse.json(scoreCategoria, { status: 201 })
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
      
      if (error.message === 'Já existe uma categoria com este nome para este score') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        )
      }
    }

    console.error('Erro ao criar categoria de score:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}