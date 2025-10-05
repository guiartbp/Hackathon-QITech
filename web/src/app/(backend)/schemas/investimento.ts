import { z } from 'zod'

// Schema para criação de investimento
export const createInvestimentoSchema = z.object({
  propostaId: z.string().uuid().optional(),
  contratoId: z.string().uuid().optional(),
  investidorId: z.string().uuid(),
  valorAportado: z.number().positive(),
  percentualParticipacao: z.number().min(0).max(100).optional(),
  statusInvestimento: z.enum(['PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO']).default('PENDENTE'),
  valorTotalRecebido: z.number().min(0).default(0),
  tirRealizado: z.number().optional(),
  dataInvestimento: z.coerce.date().default(() => new Date()),
})

// Schema para atualização de investimento
export const updateInvestimentoSchema = z.object({
  propostaId: z.string().uuid().optional(),
  contratoId: z.string().uuid().optional(),
  investidorId: z.string().uuid().optional(),
  valorAportado: z.number().positive().optional(),
  percentualParticipacao: z.number().min(0).max(100).optional(),
  statusInvestimento: z.enum(['PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO']).optional(),
  valorTotalRecebido: z.number().min(0).optional(),
  tirRealizado: z.number().optional(),
  dataInvestimento: z.coerce.date().optional(),
})

// Schema para parâmetros de query
export const investimentoQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  investidorId: z.string().uuid().optional(),
  propostaId: z.string().uuid().optional(),
  contratoId: z.string().uuid().optional(),
  statusInvestimento: z.enum(['PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO']).optional(),
  sortBy: z.enum(['dataInvestimento', 'valorAportado', 'statusInvestimento']).default('dataInvestimento'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Schema para parâmetros de rota
export const investimentoParamsSchema = z.object({
  id: z.string().uuid(),
})

// Tipos TypeScript derivados dos schemas
export type CreateInvestimentoInput = z.infer<typeof createInvestimentoSchema>
export type UpdateInvestimentoInput = z.infer<typeof updateInvestimentoSchema>
export type InvestimentoQueryParams = z.infer<typeof investimentoQuerySchema>
export type InvestimentoParams = z.infer<typeof investimentoParamsSchema>