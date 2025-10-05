import { z } from 'zod'

// Schema para criar uma nova ScoreCategoria
export const createScoreCategoriaSchema = z.object({
  scoreId: z.string().uuid('ID do score deve ser um UUID válido'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  scoreCategoria: z.number().int('Score da categoria deve ser um número inteiro').min(0, 'Score da categoria deve ser positivo'),
})

// Schema para atualizar uma ScoreCategoria
export const updateScoreCategoriaSchema = z.object({
  categoria: z.string().min(1, 'Categoria é obrigatória').optional(),
  scoreCategoria: z.number().int('Score da categoria deve ser um número inteiro').min(0, 'Score da categoria deve ser positivo').optional(),
})

// Schema para query parameters
export const scoreCategoriaQuerySchema = z.object({
  scoreId: z.string().uuid('ID do score deve ser um UUID válido').optional(),
  categoria: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'scoreCategoria', 'categoria']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const scoreCategoriaParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreateScoreCategoriaData = z.infer<typeof createScoreCategoriaSchema>
export type UpdateScoreCategoriaData = z.infer<typeof updateScoreCategoriaSchema>
export type ScoreCategoriaQuery = z.infer<typeof scoreCategoriaQuerySchema>
export type ScoreCategoriaParams = z.infer<typeof scoreCategoriaParamsSchema>