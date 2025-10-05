import { NextRequest, NextResponse } from 'next/server'
import { propostaMarketplaceService } from '../../../services/proposta-marketplace'
import { marketplaceQuerySchema } from '../../../schemas/proposta'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const queryParams = {
      statusFunding: searchParams.get('statusFunding') || undefined,
      valorSolicitadoMin: searchParams.get('valorSolicitadoMin') ? Number(searchParams.get('valorSolicitadoMin')) : undefined,
      valorSolicitadoMax: searchParams.get('valorSolicitadoMax') ? Number(searchParams.get('valorSolicitadoMax')) : undefined,
      progressoFundingMin: searchParams.get('progressoFundingMin') ? Number(searchParams.get('progressoFundingMin')) : undefined,
      progressoFundingMax: searchParams.get('progressoFundingMax') ? Number(searchParams.get('progressoFundingMax')) : undefined,
      scoreMin: searchParams.get('scoreMin') ? Number(searchParams.get('scoreMin')) : undefined,
      scoreMax: searchParams.get('scoreMax') ? Number(searchParams.get('scoreMax')) : undefined,
      tier: searchParams.get('tier') || undefined,
      segmento: searchParams.get('segmento') || undefined,
      setor: searchParams.get('setor') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sortBy: searchParams.get('sortBy') || 'criadoEm',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }

    const validatedQuery = marketplaceQuerySchema.parse(queryParams)
    const propostas = await propostaMarketplaceService.findForMarketplace(validatedQuery)

    return NextResponse.json({
      data: propostas,
      pagination: {
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        total: propostas.length,
        sortBy: validatedQuery.sortBy,
        sortOrder: validatedQuery.sortOrder
      }
    })
  } catch (error) {
    console.error('Erro ao buscar propostas do marketplace:', error)

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