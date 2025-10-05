import { z } from 'zod';

// Schema para criação de um novo Cohort
export const createCohortsSchema = z.object({
  empresaId: z.string().uuid(),
  cohortMes: z.date(),
  clientesIniciais: z.number().int().positive('Clientes iniciais deve ser positivo'),
  retencaoM0: z.number().min(0).max(100).default(100).optional(),
  retencaoM1: z.number().min(0).max(100).optional(),
  retencaoM2: z.number().min(0).max(100).optional(),
  retencaoM3: z.number().min(0).max(100).optional(),
  retencaoM6: z.number().min(0).max(100).optional(),
  retencaoM12: z.number().min(0).max(100).optional(),
  ltvMedio: z.number().positive('LTV médio deve ser positivo').optional(),
});

// Schema para atualização (todos os campos opcionais exceto os de sistema)
export const updateCohortsSchema = z.object({
  cohortMes: z.date().optional(),
  clientesIniciais: z.number().int().positive('Clientes iniciais deve ser positivo').optional(),
  retencaoM0: z.number().min(0).max(100).optional(),
  retencaoM1: z.number().min(0).max(100).optional(),
  retencaoM2: z.number().min(0).max(100).optional(),
  retencaoM3: z.number().min(0).max(100).optional(),
  retencaoM6: z.number().min(0).max(100).optional(),
  retencaoM12: z.number().min(0).max(100).optional(),
  ltvMedio: z.number().positive('LTV médio deve ser positivo').optional(),
});

// Schema para query parameters de filtro
export const cohortsQuerySchema = z.object({
  empresaId: z.string().uuid().optional(),
  cohortMes: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data deve estar em formato válido',
  }).optional(),
  mesInicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de início deve estar em formato válido',
  }).optional(),
  mesFim: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de fim deve estar em formato válido',
  }).optional(),
  clientesMinimos: z.string().transform(Number).refine(val => val >= 0, 'Clientes mínimos deve ser maior ou igual a 0').optional(),
  page: z.string().transform(Number).refine(val => val > 0, 'Página deve ser maior que 0').optional(),
  limit: z.string().transform(Number).refine(val => val > 0 && val <= 100, 'Limit deve estar entre 1 e 100').optional(),
});

// Schema de resposta completa
export const cohortsResponseSchema = z.object({
  id: z.string().uuid(),
  empresaId: z.string().uuid(),
  cohortMes: z.date(),
  clientesIniciais: z.number(),
  retencaoM0: z.number(),
  retencaoM1: z.number().nullable(),
  retencaoM2: z.number().nullable(),
  retencaoM3: z.number().nullable(),
  retencaoM6: z.number().nullable(),
  retencaoM12: z.number().nullable(),
  ltvMedio: z.number().nullable(),
  criadoEm: z.date(),
  atualizadoEm: z.date(),
});

// Tipos TypeScript derivados dos schemas
export type CreateCohortsInput = z.infer<typeof createCohortsSchema>;
export type UpdateCohortsInput = z.infer<typeof updateCohortsSchema>;
export type CohortsQueryParams = z.infer<typeof cohortsQuerySchema>;
export type CohortsResponse = z.infer<typeof cohortsResponseSchema>;