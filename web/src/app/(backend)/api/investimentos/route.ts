import { NextRequest, NextResponse } from 'next/server'
import { InvestimentoService } from '../../../(backend)/services/investimento'
import { 
  createInvestimentoSchema, 
  investimentoQuerySchema 
} from '../../../(backend)/schemas/investimento'
import { ZodError } from 'zod'

// GET /api/investimentos - Listar investimentos com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar query parameters
    const validatedParams = investimentoQuerySchema.parse(queryParams)

    const result = await InvestimentoService.list(validatedParams)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Erro ao listar investimentos:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/investimentos - Criar novo investimento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = createInvestimentoSchema.parse(body)

    const investimento = await InvestimentoService.create(validatedData)

    return NextResponse.json(investimento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar investimento:', error)

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