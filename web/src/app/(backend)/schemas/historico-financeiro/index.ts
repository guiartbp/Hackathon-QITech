import { z } from 'zod';
import type { Prisma } from '../../../../generated/prisma';

// Campos graváveis baseados no modelo HistoricoFinanceiro do Prisma
const writable = {
  empresa_id: z.string().uuid(),
  periodo: z.string().datetime(),
  tipo_relatorio: z.string().optional(),
  ativo_total: z.number().positive().optional(),
  passivo_total: z.number().positive().optional(),
  patrimonio_liquido: z.number().optional(),
  receita_liquida: z.number().positive().optional(),
  custo_aquisicao_cliente: z.number().positive().optional(),
  obrigacoes_divida: z.string().optional(),
  valor_total_dividas: z.number().positive().optional(),
  fonte_dados: z.string().optional(),
  verificado_por: z.string().optional(),
};

const historicoFinanceiroCreateSchema = z.object({
  empresa_id: writable.empresa_id,
  periodo: writable.periodo,
  tipo_relatorio: writable.tipo_relatorio,
  ativo_total: writable.ativo_total,
  passivo_total: writable.passivo_total,
  patrimonio_liquido: writable.patrimonio_liquido,
  receita_liquida: writable.receita_liquida,
  custo_aquisicao_cliente: writable.custo_aquisicao_cliente,
  obrigacoes_divida: writable.obrigacoes_divida,
  valor_total_dividas: writable.valor_total_dividas,
  fonte_dados: writable.fonte_dados,
  verificado_por: writable.verificado_por,
});

const historicoFinanceiroUpdateSchema = historicoFinanceiroCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Nenhum campo para atualizar.' }
);

const historicoFinanceiroQuerySchema = z.object({
  id: z.string().optional(),
  empresa_id: z.string().optional(),
  periodo: z.string().datetime().optional(),
  tipo_relatorio: z.string().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type HistoricoFinanceiroCreateInput = z.infer<typeof historicoFinanceiroCreateSchema>;
export type HistoricoFinanceiroUpdateInput = z.infer<typeof historicoFinanceiroUpdateSchema>;
export type HistoricoFinanceiroQueryInput = z.infer<typeof historicoFinanceiroQuerySchema>;

function parseURLParams(url: string): HistoricoFinanceiroQueryInput {
  const { searchParams } = new URL(url);
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return historicoFinanceiroQuerySchema.parse(params);
}

export function parseCreate(data: unknown): Prisma.HistoricoFinanceiroCreateInput {
  const parsed = historicoFinanceiroCreateSchema.parse(data);
  
  return {
    empresa: { connect: { id: parsed.empresa_id } },
    periodo: new Date(parsed.periodo),
    tipoRelatorio: parsed.tipo_relatorio,
    ativoTotal: parsed.ativo_total,
    passivoTotal: parsed.passivo_total,
    patrimonioLiquido: parsed.patrimonio_liquido,
    receitaLiquida: parsed.receita_liquida,
    custoAquisicaoCliente: parsed.custo_aquisicao_cliente,
    obrigacoesDivida: parsed.obrigacoes_divida,
    valorTotalDividas: parsed.valor_total_dividas,
    fonteDados: parsed.fonte_dados,
    verificadoPor: parsed.verificado_por,
  };
}

export function parseUpdate(data: unknown): Prisma.HistoricoFinanceiroUpdateInput {
  const parsed = historicoFinanceiroUpdateSchema.parse(data);
  
  const updateData: Prisma.HistoricoFinanceiroUpdateInput = {};
  
  if (parsed.empresa_id) updateData.empresa = { connect: { id: parsed.empresa_id } };
  if (parsed.periodo) updateData.periodo = new Date(parsed.periodo);
  if (parsed.tipo_relatorio !== undefined) updateData.tipoRelatorio = parsed.tipo_relatorio;
  if (parsed.ativo_total !== undefined) updateData.ativoTotal = parsed.ativo_total;
  if (parsed.passivo_total !== undefined) updateData.passivoTotal = parsed.passivo_total;
  if (parsed.patrimonio_liquido !== undefined) updateData.patrimonioLiquido = parsed.patrimonio_liquido;
  if (parsed.receita_liquida !== undefined) updateData.receitaLiquida = parsed.receita_liquida;
  if (parsed.custo_aquisicao_cliente !== undefined) updateData.custoAquisicaoCliente = parsed.custo_aquisicao_cliente;
  if (parsed.obrigacoes_divida !== undefined) updateData.obrigacoesDivida = parsed.obrigacoes_divida;
  if (parsed.valor_total_dividas !== undefined) updateData.valorTotalDividas = parsed.valor_total_dividas;
  if (parsed.fonte_dados !== undefined) updateData.fonteDados = parsed.fonte_dados;
  if (parsed.verificado_por !== undefined) updateData.verificadoPor = parsed.verificado_por;
  
  return updateData;
}

export function parseQuery(url: string): HistoricoFinanceiroQueryInput {
  return parseURLParams(url);
}