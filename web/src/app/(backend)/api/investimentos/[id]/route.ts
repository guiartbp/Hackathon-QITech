import { NextRequest, NextResponse } from 'next/server'
import { InvestimentoService } from '../../../../(backend)/services/investimento'
import { 
  updateInvestimentoSchema, 
  investimentoParamsSchema 
} from '../../../../(backend)/schemas/investimento'
import { ZodError } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/investimentos/[id] - Buscar investimento por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar parâmetro ID
    const validatedParams = investimentoParamsSchema.parse(params)

    const investimento = await InvestimentoService.findById(validatedParams.id)

    return NextResponse.json(investimento, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar investimento:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Investimento não encontrado') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/investimentos/[id] - Atualizar investimento
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar parâmetro ID
    const validatedParams = investimentoParamsSchema.parse(params)

    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateInvestimentoSchema.parse(body)

    const investimento = await InvestimentoService.update(
      validatedParams.id,
      validatedData
    )

    return NextResponse.json(investimento, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar investimento:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Erros específicos do service
      if (error.message.includes('não encontrado')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/investimentos/[id] - Deletar investimento
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar parâmetro ID
    const validatedParams = investimentoParamsSchema.parse(params)

    const result = await InvestimentoService.delete(validatedParams.id)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar investimento:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Investimento não encontrado') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}