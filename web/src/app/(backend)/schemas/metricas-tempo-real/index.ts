import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis baseados no modelo MetricasTempoReal do Prisma
const writable = {
  empresa_id: z.string().uuid(),
  timestamp_captura: z.string().datetime().optional(),
  mrr: z.number().positive().optional(),
  arr: z.number().positive().optional(),
  nrr: z.number().min(0).max(999.99).optional(),
  usuarios_ativos: z.number().int().min(0).optional(),
  churn_rate: z.number().min(0).max(1).optional(),
  opex_mensal: z.number().positive().optional(),
  ltv_cac_ajustado: z.number().min(0).max(999.99).optional(),
  dscr_ajustado: z.number().min(0).max(999.99).optional(),
};

const metricasTempoRealCreateSchema = z.object({
  empresa_id: writable.empresa_id,
  timestamp_captura: writable.timestamp_captura,
  mrr: writable.mrr,
  arr: writable.arr,
  nrr: writable.nrr,
  usuarios_ativos: writable.usuarios_ativos,
  churn_rate: writable.churn_rate,
  opex_mensal: writable.opex_mensal,
  ltv_cac_ajustado: writable.ltv_cac_ajustado,
  dscr_ajustado: writable.dscr_ajustado,
});

const metricasTempoRealUpdateSchema = metricasTempoRealCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const metricasTempoRealQuerySchema = z.object({
  id: z.string().optional(),
  empresa_id: z.string().optional(),
  timestamp_captura: z.string().datetime().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type MetricasTempoRealCreateInput = z.infer<typeof metricasTempoRealCreateSchema>;
export type MetricasTempoRealUpdateInput = z.infer<typeof metricasTempoRealUpdateSchema>;
export type MetricasTempoRealQueryInput = z.infer<typeof metricasTempoRealQuerySchema>;

function parseURLParams(url: string): MetricasTempoRealQueryInput {
  const { searchParams } = new URL(url);
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return metricasTempoRealQuerySchema.parse(params);
}

export function parseCreate(data: unknown): Prisma.MetricasTempoRealCreateInput {
  const parsed = metricasTempoRealCreateSchema.parse(data);
  
  return {
    empresa: { connect: { id: parsed.empresa_id } },
    timestampCaptura: parsed.timestamp_captura ? new Date(parsed.timestamp_captura) : new Date(),
    mrr: parsed.mrr,
    arr: parsed.arr,
    nrr: parsed.nrr,
    usuariosAtivos: parsed.usuarios_ativos,
    churnRate: parsed.churn_rate,
    opexMensal: parsed.opex_mensal,
    ltvCacAjustado: parsed.ltv_cac_ajustado,
    dscrAjustado: parsed.dscr_ajustado,
  };
}

export function parseUpdate(data: unknown): Prisma.MetricasTempoRealUpdateInput {
  const parsed = metricasTempoRealUpdateSchema.parse(data);
  
  const updateData: Prisma.MetricasTempoRealUpdateInput = {};
  
  if (parsed.empresa_id) updateData.empresa = { connect: { id: parsed.empresa_id } };
  if (parsed.timestamp_captura) updateData.timestampCaptura = new Date(parsed.timestamp_captura);
  if (parsed.mrr !== undefined) updateData.mrr = parsed.mrr;
  if (parsed.arr !== undefined) updateData.arr = parsed.arr;
  if (parsed.nrr !== undefined) updateData.nrr = parsed.nrr;
  if (parsed.usuarios_ativos !== undefined) updateData.usuariosAtivos = parsed.usuarios_ativos;
  if (parsed.churn_rate !== undefined) updateData.churnRate = parsed.churn_rate;
  if (parsed.opex_mensal !== undefined) updateData.opexMensal = parsed.opex_mensal;
  if (parsed.ltv_cac_ajustado !== undefined) updateData.ltvCacAjustado = parsed.ltv_cac_ajustado;
  if (parsed.dscr_ajustado !== undefined) updateData.dscrAjustado = parsed.dscr_ajustado;
  
  return updateData;
}

export function parseQuery(url: string): MetricasTempoRealQueryInput {
  return parseURLParams(url);
}