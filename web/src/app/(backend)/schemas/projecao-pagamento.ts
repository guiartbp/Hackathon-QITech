import { z } from "zod";

export const createProjecaoPagamentoSchema = z.object({
  contratoId: z.string().uuid(),
  mesReferencia: z.coerce.date(),
  mrrProjetado: z.number().optional(),
  valorProjetado: z.number(),
  confianca: z.number().optional(),
  metodoProjecao: z.string().optional(),
});

export const updateProjecaoPagamentoSchema = z.object({
  contratoId: z.string().uuid().optional(),
  mesReferencia: z.coerce.date().optional(),
  mrrProjetado: z.number().optional(),
  valorProjetado: z.number().optional(),
  confianca: z.number().optional(),
  metodoProjecao: z.string().optional(),
});

export const projecaoPagamentoResponseSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  mesReferencia: z.date(),
  mrrProjetado: z.number().nullable(),
  valorProjetado: z.number(),
  confianca: z.number().nullable(),
  metodoProjecao: z.string().nullable(),
  criadoEm: z.date(),
});

export type CreateProjecaoPagamentoInput = z.infer<typeof createProjecaoPagamentoSchema>;
export type UpdateProjecaoPagamentoInput = z.infer<typeof updateProjecaoPagamentoSchema>;
export type ProjecaoPagamentoResponse = z.infer<typeof projecaoPagamentoResponseSchema>;