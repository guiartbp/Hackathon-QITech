import { z } from 'zod'

// Schema para criar uma nova Proposta
export const createPropostaSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido'),
  valorSolicitado: z.number().positive('Valor solicitado deve ser positivo'),
  multiploCap: z.number().positive('Múltiplo CAP deve ser positivo'),
  percentualMrr: z.number().min(0, 'Percentual MRR deve ser não negativo').max(100, 'Percentual MRR deve ser no máximo 100'),
  duracaoMeses: z.number().int('Duração em meses deve ser um número inteiro').min(1, 'Duração deve ser pelo menos 1 mês'),
  valorMinimoFunding: z.number().positive('Valor mínimo de funding deve ser positivo').optional(),
  planoUsoFundos: z.string().optional(),
  statusFunding: z.string().optional().default('RASCUNHO'),
  valorFinanciado: z.number().min(0, 'Valor financiado deve ser não negativo').optional().default(0),
  progressoFunding: z.number().min(0, 'Progresso deve ser não negativo').max(100, 'Progresso deve ser no máximo 100').optional().default(0),
  dataAbertura: z.string().datetime('Data de abertura deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  dataFechamento: z.string().datetime('Data de fechamento deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  diasAberta: z.number().int('Dias aberta deve ser um número inteiro').min(0).optional(),
  scoreNaAbertura: z.number().int('Score na abertura deve ser um número inteiro').min(0).max(1000).optional(),
})

// Schema para atualizar uma Proposta
export const updatePropostaSchema = z.object({
  valorSolicitado: z.number().positive('Valor solicitado deve ser positivo').optional(),
  multiploCap: z.number().positive('Múltiplo CAP deve ser positivo').optional(),
  percentualMrr: z.number().min(0, 'Percentual MRR deve ser não negativo').max(100, 'Percentual MRR deve ser no máximo 100').optional(),
  duracaoMeses: z.number().int('Duração em meses deve ser um número inteiro').min(1, 'Duração deve ser pelo menos 1 mês').optional(),
  valorMinimoFunding: z.number().positive('Valor mínimo de funding deve ser positivo').optional(),
  planoUsoFundos: z.string().optional(),
  statusFunding: z.string().optional(),
  valorFinanciado: z.number().min(0, 'Valor financiado deve ser não negativo').optional(),
  progressoFunding: z.number().min(0, 'Progresso deve ser não negativo').max(100, 'Progresso deve ser no máximo 100').optional(),
  dataAbertura: z.string().datetime('Data de abertura deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  dataFechamento: z.string().datetime('Data de fechamento deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  diasAberta: z.number().int('Dias aberta deve ser um número inteiro').min(0).optional(),
  scoreNaAbertura: z.number().int('Score na abertura deve ser um número inteiro').min(0).max(1000).optional(),
})

// Schema para query parameters
export const propostaQuerySchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
  statusFunding: z.string().optional(),
  valorSolicitadoMin: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  valorSolicitadoMax: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  valorFinanciadoMin: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  valorFinanciadoMax: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  progressoFundingMin: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  progressoFundingMax: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  dataAberturaInicio: z.string().datetime('Data deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  dataAberturaFim: z.string().datetime('Data deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'atualizadoEm', 'valorSolicitado', 'valorFinanciado', 'progressoFunding', 'dataAbertura']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema específico para marketplace com filtros de score
export const marketplaceQuerySchema = z.object({
  statusFunding: z.string().optional(),
  valorSolicitadoMin: z.number().positive().optional(),
  valorSolicitadoMax: z.number().positive().optional(),
  progressoFundingMin: z.number().min(0).max(100).optional(),
  progressoFundingMax: z.number().min(0).max(100).optional(),
  scoreMin: z.number().min(0).max(1000).optional(),
  scoreMax: z.number().min(0).max(1000).optional(),
  tier: z.string().optional(),
  segmento: z.string().optional(),
  setor: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
  sortBy: z.enum(['criadoEm', 'atualizadoEm', 'valorSolicitado', 'progressoFunding', 'scoreTotal']).optional().default('criadoEm'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const propostaParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreatePropostaData = z.infer<typeof createPropostaSchema>
export type UpdatePropostaData = z.infer<typeof updatePropostaSchema>
export type PropostaQuery = z.infer<typeof propostaQuerySchema>
export type MarketplaceQuery = z.infer<typeof marketplaceQuerySchema>
export type PropostaParams = z.infer<typeof propostaParamsSchema>