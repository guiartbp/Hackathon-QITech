import { z } from 'zod'

// Schema para criar uma nova ScoreFeature
export const createScoreFeatureSchema = z.object({
  scoreCategoriaId: z.string().uuid('ID da categoria de score deve ser um UUID válido'),
  featureNome: z.string().min(1, 'Nome da feature é obrigatório'),
  featureValor: z.number().optional(),
  featurePeso: z.number().int('Peso da feature deve ser um número inteiro').optional(),
})

// Schema para atualizar uma ScoreFeature
export const updateScoreFeatureSchema = z.object({
  featureNome: z.string().min(1, 'Nome da feature é obrigatório').optional(),
  featureValor: z.number().optional(),
  featurePeso: z.number().int('Peso da feature deve ser um número inteiro').optional(),
})

// Schema para query parameters
export const scoreFeatureQuerySchema = z.object({
  scoreCategoriaId: z.string().uuid('ID da categoria de score deve ser um UUID válido').optional(),
  featureNome: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'featureNome', 'featureValor', 'featurePeso']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const scoreFeatureParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreateScoreFeatureData = z.infer<typeof createScoreFeatureSchema>
export type UpdateScoreFeatureData = z.infer<typeof updateScoreFeatureSchema>
export type ScoreFeatureQuery = z.infer<typeof scoreFeatureQuerySchema>
export type ScoreFeatureParams = z.infer<typeof scoreFeatureParamsSchema>