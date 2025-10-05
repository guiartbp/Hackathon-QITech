import { NextRequest, NextResponse } from 'next/server'
import { insightService } from '../../../services/insight'
import { updateInsightSchema, insightParamsSchema } from '../../../schemas/insight'
import { z } from 'zod'

interface RouteContext {
  params: {
    id: string
  }
}

// GET /api/insights/[id] - Buscar insight por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = insightParamsSchema.parse(context.params)

    const insight = await insightService.findById(id)

    if (!insight) {
      return NextResponse.json(
        { error: 'Insight não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(insight)
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

    console.error('Erro ao buscar insight:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/insights/[id] - Atualizar insight
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = insightParamsSchema.parse(context.params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateInsightSchema.parse(body)

    const insight = await insightService.update(id, validatedData)

    return NextResponse.json(insight)
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
      if (error.message === 'Insight não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao atualizar insight:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/insights/[id] - Deletar insight
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Validar parâmetros da rota
    const { id } = insightParamsSchema.parse(context.params)

    const insight = await insightService.delete(id)

    return NextResponse.json(insight)
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
      if (error.message === 'Insight não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    console.error('Erro ao deletar insight:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}