import { z } from 'zod';

// Schema para criação de um novo TopClientes
export const createTopClientesSchema = z.object({
  empresaId: z.string().uuid(),
  mesReferencia: z.date(),
  clienteNome: z.string().min(1, 'Nome do cliente é obrigatório'),
  clienteEmoji: z.string().optional(),
  plano: z.string().optional(),
  mrrCliente: z.number().positive('MRR do cliente deve ser positivo'),
  percentualMrrTotal: z.number().min(0).max(100).optional(),
});

// Schema para atualização (todos os campos opcionais exceto os de sistema)
export const updateTopClientesSchema = z.object({
  mesReferencia: z.date().optional(),
  clienteNome: z.string().min(1, 'Nome do cliente é obrigatório').optional(),
  clienteEmoji: z.string().optional(),
  plano: z.string().optional(),
  mrrCliente: z.number().positive('MRR do cliente deve ser positivo').optional(),
  percentualMrrTotal: z.number().min(0).max(100).optional(),
});

// Schema para query parameters de filtro
export const topClientesQuerySchema = z.object({
  empresaId: z.string().uuid().optional(),
  mesReferencia: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data deve estar em formato válido',
  }).optional(),
  clienteNome: z.string().optional(),
  plano: z.string().optional(),
  page: z.string().transform(Number).refine(val => val > 0, 'Página deve ser maior que 0').optional(),
  limit: z.string().transform(Number).refine(val => val > 0 && val <= 100, 'Limit deve estar entre 1 e 100').optional(),
});

// Schema de resposta completa
export const topClientesResponseSchema = z.object({
  id: z.string().uuid(),
  empresaId: z.string().uuid(),
  mesReferencia: z.date(),
  clienteNome: z.string(),
  clienteEmoji: z.string().nullable(),
  plano: z.string().nullable(),
  mrrCliente: z.number(),
  percentualMrrTotal: z.number().nullable(),
  criadoEm: z.date(),
});

// Tipos TypeScript derivados dos schemas
export type CreateTopClientesInput = z.infer<typeof createTopClientesSchema>;
export type UpdateTopClientesInput = z.infer<typeof updateTopClientesSchema>;
export type TopClientesQueryParams = z.infer<typeof topClientesQuerySchema>;
export type TopClientesResponse = z.infer<typeof topClientesResponseSchema>;