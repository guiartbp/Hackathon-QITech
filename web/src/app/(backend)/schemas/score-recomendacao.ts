import { z } from 'zod'

// Schema para criar uma nova ScoreRecomendacao
export const createScoreRecomendacaoSchema = z.object({
  scoreId: z.string().uuid('ID do score deve ser um UUID válido'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  impactoEstimado: z.number().int('Impacto estimado deve ser um número inteiro').optional(),
  prioridade: z.number().int('Prioridade deve ser um número inteiro').min(1).max(10).optional(),
})

// Schema para atualizar uma ScoreRecomendacao
export const updateScoreRecomendacaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').optional(),
  categoria: z.string().min(1, 'Categoria é obrigatória').optional(),
  impactoEstimado: z.number().int('Impacto estimado deve ser um número inteiro').optional(),
  prioridade: z.number().int('Prioridade deve ser um número inteiro').min(1).max(10).optional(),
})

// Schema para query parameters
export const scoreRecomendacaoQuerySchema = z.object({
  scoreId: z.string().uuid('ID do score deve ser um UUID válido').optional(),
  categoria: z.string().optional(),
  titulo: z.string().optional(),
  prioridade: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'titulo', 'categoria', 'prioridade', 'impactoEstimado']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const scoreRecomendacaoParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreateScoreRecomendacaoData = z.infer<typeof createScoreRecomendacaoSchema>
export type UpdateScoreRecomendacaoData = z.infer<typeof updateScoreRecomendacaoSchema>
export type ScoreRecomendacaoQuery = z.infer<typeof scoreRecomendacaoQuerySchema>
export type ScoreRecomendacaoParams = z.infer<typeof scoreRecomendacaoParamsSchema>