import { NextRequest, NextResponse } from 'next/server'
import { propostaService } from '../../services/proposta'
import { createPropostaSchema, propostaQuerySchema } from '../../schemas/proposta'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const queryParams = {
      empresaId: searchParams.get('empresaId') || undefined,
      statusFunding: searchParams.get('statusFunding') || undefined,
      valorSolicitadoMin: searchParams.get('valorSolicitadoMin') ? Number(searchParams.get('valorSolicitadoMin')) : undefined,
      valorSolicitadoMax: searchParams.get('valorSolicitadoMax') ? Number(searchParams.get('valorSolicitadoMax')) : undefined,
      valorFinanciadoMin: searchParams.get('valorFinanciadoMin') ? Number(searchParams.get('valorFinanciadoMin')) : undefined,
      valorFinanciadoMax: searchParams.get('valorFinanciadoMax') ? Number(searchParams.get('valorFinanciadoMax')) : undefined,
      progressoFundingMin: searchParams.get('progressoFundingMin') ? Number(searchParams.get('progressoFundingMin')) : undefined,
      progressoFundingMax: searchParams.get('progressoFundingMax') ? Number(searchParams.get('progressoFundingMax')) : undefined,
      dataAberturaInicio: searchParams.get('dataAberturaInicio') ? new Date(searchParams.get('dataAberturaInicio')!) : undefined,
      dataAberturaFim: searchParams.get('dataAberturaFim') ? new Date(searchParams.get('dataAberturaFim')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sortBy: searchParams.get('sortBy') || 'criadoEm',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }

    const validatedQuery = propostaQuerySchema.parse(queryParams)
    const propostas = await propostaService.findMany(validatedQuery)

    return NextResponse.json({
      data: propostas,
      pagination: {
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        sortBy: validatedQuery.sortBy,
        sortOrder: validatedQuery.sortOrder
      }
    })
  } catch (error) {
    console.error('Erro ao buscar propostas:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPropostaSchema.parse(body)

    const proposta = await propostaService.create(validatedData)

    return NextResponse.json(proposta, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar proposta:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
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
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}