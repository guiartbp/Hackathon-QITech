import { z } from 'zod'

// Schema para criar um novo Insight
export const createInsightSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  categoria: z.string().optional(),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  isLido: z.boolean().optional().default(false),
  isArquivado: z.boolean().optional().default(false),
  dataExpiracao: z.string().datetime('Data de expiração deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
})

// Schema para atualizar um Insight
export const updateInsightSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório').optional(),
  categoria: z.string().optional(),
  titulo: z.string().min(1, 'Título é obrigatório').optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').optional(),
  isLido: z.boolean().optional(),
  isArquivado: z.boolean().optional(),
  dataExpiracao: z.string().datetime('Data de expiração deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
})

// Schema para query parameters
export const insightQuerySchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
  tipo: z.string().optional(),
  categoria: z.string().optional(),
  titulo: z.string().optional(),
  isLido: z.string().transform((val) => val === 'true').optional(),
  isArquivado: z.string().transform((val) => val === 'true').optional(),
  dataExpiracaoInicio: z.string().datetime('Data deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  dataExpiracaoFim: z.string().datetime('Data deve estar em formato ISO 8601').transform((str) => new Date(str)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['criadoEm', 'titulo', 'tipo', 'categoria', 'dataExpiracao']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Schema para parâmetros de rota
export const insightParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

// Tipos TypeScript derivados dos schemas
export type CreateInsightData = z.infer<typeof createInsightSchema>
export type UpdateInsightData = z.infer<typeof updateInsightSchema>
export type InsightQuery = z.infer<typeof insightQuerySchema>
export type InsightParams = z.infer<typeof insightParamsSchema>