import { z } from 'zod'

// Schema para criar um novo Score
export const createScoreSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido'),
  scoreTotal: z.number().int('Score total deve ser um número inteiro').min(0, 'Score total deve ser positivo'),
  tier: z.string().min(1, 'Tier é obrigatório'),
  variacaoMensal: z.number().int('Variação mensal deve ser um número inteiro').optional(),
  rankingPercentil: z.number().int('Ranking percentil deve ser um número inteiro').min(0).max(100).optional(),
  tipoScore: z.string().min(1, 'Tipo de score é obrigatório'),
  metodo: z.string().optional(),
})

// Schema para atualizar um Score
export const updateScoreSchema = z.object({
  scoreTotal: z.number().int('Score total deve ser um número inteiro').min(0, 'Score total deve ser positivo').optional(),
  tier: z.string().min(1, 'Tier é obrigatório').optional(),
  variacaoMensal: z.number().int('Variação mensal deve ser um número inteiro').optional(),
  rankingPercentil: z.number().int('Ranking percentil deve ser um número inteiro').min(0).max(100).optional(),
  tipoScore: z.string().min(1, 'Tipo de score é obrigatório').optional(),
  metodo: z.string().optional(),
})

// Schema para query parameters
export const scoreQuerySchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
  tier: z.string().optional(),
  tipoScore: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'scoreTotal', 'tier']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const scoreParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreateScoreData = z.infer<typeof createScoreSchema>
export type UpdateScoreData = z.infer<typeof updateScoreSchema>
export type ScoreQuery = z.infer<typeof scoreQuerySchema>
export type ScoreParams = z.infer<typeof scoreParamsSchema>