import { z } from "zod";
import { idSchema } from "../base.schema";

// Schema para valores decimais de métricas financeiras (15,2)
export const metricaFinanceiraSchema = z
  .number()
  .or(z.string())
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .refine((val) => !isNaN(val), "Deve ser um número válido")
  .refine((val) => val >= 0, "Valor deve ser positivo")
  .optional()
  .nullable();

// Schema para percentuais (8,2) - aceita valores de 0 a 999.99%
export const percentualSchema = z
  .number()
  .or(z.string())
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .refine((val) => !isNaN(val), "Deve ser um número válido")
  .refine((val) => val >= 0, "Percentual deve ser positivo")
  .optional()
  .nullable();

// Schema para churn rate (8,4) - maior precisão decimal
export const churnRateSchema = z
  .number()
  .or(z.string())
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .refine((val) => !isNaN(val), "Deve ser um número válido")
  .refine((val) => val >= 0 && val <= 1, "Churn rate deve estar entre 0 e 1")
  .optional()
  .nullable();

// Schema para data de referência (mês)
export const mesReferenciaSchema = z
  .string()
  .or(z.date())
  .transform((val) => {
    if (val instanceof Date) return val;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }
    return date;
  })
  .refine((date) => date <= new Date(), "Data não pode ser no futuro");

// Schema base para criação de MetricasMensais
export const createMetricasMensaisSchema = z.object({
  empresaId: idSchema,
  mesReferencia: mesReferenciaSchema,
  mrrFinal: metricaFinanceiraSchema,
  mrrMedio: metricaFinanceiraSchema,
  arrFinal: metricaFinanceiraSchema,
  nrrMensal: percentualSchema,
  numClientesInicio: z.number().int().min(0).optional().nullable(),
  numClientesFinal: z.number().int().min(0).optional().nullable(),
  novosClientes: z.number().int().min(0).optional().nullable(),
  clientesCancelados: z.number().int().min(0).optional().nullable(),
  investimentoMarketingVendas: metricaFinanceiraSchema,
  cacPago: metricaFinanceiraSchema,
  ltvMedio: metricaFinanceiraSchema,
  ltvCacRatio: percentualSchema,
  ticketMedio: metricaFinanceiraSchema,
  receitaTotal: metricaFinanceiraSchema,
  opexMensal: metricaFinanceiraSchema,
  netBurnMensal: metricaFinanceiraSchema,
  cashBalanceFinal: metricaFinanceiraSchema,
  cashRunwayMeses: z.number().int().min(0).optional().nullable(),
  expansionMrr: metricaFinanceiraSchema,
  contractionMrr: metricaFinanceiraSchema,
  expansionPct: percentualSchema,
  contractionPct: percentualSchema,
  churnRateMedio: churnRateSchema,
  dscrAjustadoMensal: percentualSchema,
  margemBruta: percentualSchema,
  burnMultiple: percentualSchema,
  cacPaybackMeses: z.number().int().min(0).optional().nullable(),
  magicNumber: percentualSchema,
});

// Schema para atualização (todos os campos são opcionais exceto o ID)
export const updateMetricasMensaisSchema = createMetricasMensaisSchema
  .partial()
  .extend({
    id: idSchema,
  });

// Schema de resposta
export const metricasMensaisResponseSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  mesReferencia: z.date(),
  mrrFinal: z.number().nullable(),
  mrrMedio: z.number().nullable(),
  arrFinal: z.number().nullable(),
  nrrMensal: z.number().nullable(),
  numClientesInicio: z.number().nullable(),
  numClientesFinal: z.number().nullable(),
  novosClientes: z.number().nullable(),
  clientesCancelados: z.number().nullable(),
  investimentoMarketingVendas: z.number().nullable(),
  cacPago: z.number().nullable(),
  ltvMedio: z.number().nullable(),
  ltvCacRatio: z.number().nullable(),
  ticketMedio: z.number().nullable(),
  receitaTotal: z.number().nullable(),
  opexMensal: z.number().nullable(),
  netBurnMensal: z.number().nullable(),
  cashBalanceFinal: z.number().nullable(),
  cashRunwayMeses: z.number().nullable(),
  expansionMrr: z.number().nullable(),
  contractionMrr: z.number().nullable(),
  expansionPct: z.number().nullable(),
  contractionPct: z.number().nullable(),
  churnRateMedio: z.number().nullable(),
  dscrAjustadoMensal: z.number().nullable(),
  margemBruta: z.number().nullable(),
  burnMultiple: z.number().nullable(),
  cacPaybackMeses: z.number().nullable(),
  magicNumber: z.number().nullable(),
  criadoEm: z.date(),
});

// Schema para parâmetros de query
export const metricasMensaisQuerySchema = z.object({
  empresaId: idSchema.optional(),
  mesReferencia: z.string().optional(),
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0).optional().default(() => 1),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100).optional().default(() => 10),
  sortBy: z.enum(["mesReferencia", "criadoEm", "mrrFinal"]).optional().default("mesReferencia"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Schema para parâmetros de rota
export const metricasMensaisParamsSchema = z.object({
  id: idSchema,
});

export type CreateMetricasMensaisInput = z.infer<typeof createMetricasMensaisSchema>;
export type UpdateMetricasMensaisInput = z.infer<typeof updateMetricasMensaisSchema>;
export type MetricasMensaisResponse = z.infer<typeof metricasMensaisResponseSchema>;
export type MetricasMensaisQuery = z.infer<typeof metricasMensaisQuerySchema>;
export type MetricasMensaisParams = z.infer<typeof metricasMensaisParamsSchema>;

// Função para fazer parse dos parâmetros da URL
function parseURLParams(url: string): MetricasMensaisQuery {
  const { searchParams } = new URL(url);
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return metricasMensaisQuerySchema.parse(params);
}

// Função para fazer parse dos dados de criação
export function parseCreate(data: unknown): import('../../../../generated/prisma').Prisma.MetricasMensaisCreateInput {
  const parsed = createMetricasMensaisSchema.parse(data);
  
  return {
    empresa: { connect: { id: parsed.empresaId } },
    mesReferencia: parsed.mesReferencia,
    mrrFinal: parsed.mrrFinal,
    mrrMedio: parsed.mrrMedio,
    arrFinal: parsed.arrFinal,
    nrrMensal: parsed.nrrMensal,
    numClientesInicio: parsed.numClientesInicio,
    numClientesFinal: parsed.numClientesFinal,
    novosClientes: parsed.novosClientes,
    clientesCancelados: parsed.clientesCancelados,
    investimentoMarketingVendas: parsed.investimentoMarketingVendas,
    cacPago: parsed.cacPago,
    ltvMedio: parsed.ltvMedio,
    ltvCacRatio: parsed.ltvCacRatio,
    ticketMedio: parsed.ticketMedio,
    receitaTotal: parsed.receitaTotal,
    opexMensal: parsed.opexMensal,
    netBurnMensal: parsed.netBurnMensal,
    cashBalanceFinal: parsed.cashBalanceFinal,
    cashRunwayMeses: parsed.cashRunwayMeses,
    expansionMrr: parsed.expansionMrr,
    contractionMrr: parsed.contractionMrr,
    expansionPct: parsed.expansionPct,
    contractionPct: parsed.contractionPct,
    churnRateMedio: parsed.churnRateMedio,
    dscrAjustadoMensal: parsed.dscrAjustadoMensal,
    margemBruta: parsed.margemBruta,
    burnMultiple: parsed.burnMultiple,
    cacPaybackMeses: parsed.cacPaybackMeses,
    magicNumber: parsed.magicNumber,
  };
}

// Função para fazer parse dos dados de atualização
export function parseUpdate(data: unknown): import('../../../../generated/prisma').Prisma.MetricasMensaisUpdateInput {
  const parsed = updateMetricasMensaisSchema.parse(data);
  
  const updateData: import('../../../../generated/prisma').Prisma.MetricasMensaisUpdateInput = {};
  
  if (parsed.empresaId) updateData.empresa = { connect: { id: parsed.empresaId } };
  if (parsed.mesReferencia !== undefined) updateData.mesReferencia = parsed.mesReferencia;
  if (parsed.mrrFinal !== undefined) updateData.mrrFinal = parsed.mrrFinal;
  if (parsed.mrrMedio !== undefined) updateData.mrrMedio = parsed.mrrMedio;
  if (parsed.arrFinal !== undefined) updateData.arrFinal = parsed.arrFinal;
  if (parsed.nrrMensal !== undefined) updateData.nrrMensal = parsed.nrrMensal;
  if (parsed.numClientesInicio !== undefined) updateData.numClientesInicio = parsed.numClientesInicio;
  if (parsed.numClientesFinal !== undefined) updateData.numClientesFinal = parsed.numClientesFinal;
  if (parsed.novosClientes !== undefined) updateData.novosClientes = parsed.novosClientes;
  if (parsed.clientesCancelados !== undefined) updateData.clientesCancelados = parsed.clientesCancelados;
  if (parsed.investimentoMarketingVendas !== undefined) updateData.investimentoMarketingVendas = parsed.investimentoMarketingVendas;
  if (parsed.cacPago !== undefined) updateData.cacPago = parsed.cacPago;
  if (parsed.ltvMedio !== undefined) updateData.ltvMedio = parsed.ltvMedio;
  if (parsed.ltvCacRatio !== undefined) updateData.ltvCacRatio = parsed.ltvCacRatio;
  if (parsed.ticketMedio !== undefined) updateData.ticketMedio = parsed.ticketMedio;
  if (parsed.receitaTotal !== undefined) updateData.receitaTotal = parsed.receitaTotal;
  if (parsed.opexMensal !== undefined) updateData.opexMensal = parsed.opexMensal;
  if (parsed.netBurnMensal !== undefined) updateData.netBurnMensal = parsed.netBurnMensal;
  if (parsed.cashBalanceFinal !== undefined) updateData.cashBalanceFinal = parsed.cashBalanceFinal;
  if (parsed.cashRunwayMeses !== undefined) updateData.cashRunwayMeses = parsed.cashRunwayMeses;
  if (parsed.expansionMrr !== undefined) updateData.expansionMrr = parsed.expansionMrr;
  if (parsed.contractionMrr !== undefined) updateData.contractionMrr = parsed.contractionMrr;
  if (parsed.expansionPct !== undefined) updateData.expansionPct = parsed.expansionPct;
  if (parsed.contractionPct !== undefined) updateData.contractionPct = parsed.contractionPct;
  if (parsed.churnRateMedio !== undefined) updateData.churnRateMedio = parsed.churnRateMedio;
  if (parsed.dscrAjustadoMensal !== undefined) updateData.dscrAjustadoMensal = parsed.dscrAjustadoMensal;
  if (parsed.margemBruta !== undefined) updateData.margemBruta = parsed.margemBruta;
  if (parsed.burnMultiple !== undefined) updateData.burnMultiple = parsed.burnMultiple;
  if (parsed.cacPaybackMeses !== undefined) updateData.cacPaybackMeses = parsed.cacPaybackMeses;
  if (parsed.magicNumber !== undefined) updateData.magicNumber = parsed.magicNumber;
  
  return updateData;
}

// Função para fazer parse dos parâmetros de query
export function parseQuery(url: string): MetricasMensaisQuery {
  return parseURLParams(url);
}