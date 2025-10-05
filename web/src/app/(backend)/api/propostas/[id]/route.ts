import { NextRequest, NextResponse } from 'next/server'
import { propostaService } from '../../../services/proposta'
import { updatePropostaSchema } from '../../../schemas/proposta'
import { ZodError } from 'zod'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const proposta = await propostaService.findById(params.id)

    if (!proposta) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(proposta)
  } catch (error) {
    console.error('Erro ao buscar proposta:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    const validatedData = updatePropostaSchema.parse(body)

    const proposta = await propostaService.update(params.id, validatedData)

    return NextResponse.json(proposta)
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      if (error.message === 'Proposta não encontrada') {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const proposta = await propostaService.delete(params.id)

    return NextResponse.json(proposta)
  } catch (error) {
    console.error('Erro ao deletar proposta:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Proposta não encontrada') {
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