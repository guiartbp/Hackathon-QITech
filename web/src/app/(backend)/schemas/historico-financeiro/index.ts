import { z } from "zod";

export const HistoricoFinanceiroSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  periodo: z.string().datetime("Data do período é obrigatória"),
  tipoRelatorio: z.string().optional(),
  ativoTotal: z.number().optional(),
  passivoTotal: z.number().optional(),
  patrimonioLiquido: z.number().optional(),
  receitaLiquida: z.number().optional(),
  custoAquisicaoCliente: z.number().optional(),
  obrigacoesDivida: z.string().optional(),
  valorTotalDividas: z.number().optional(),
  fonteDados: z.string().optional(),
  verificadoPor: z.string().optional(),
});

export type HistoricoFinanceiroInput = z.infer<typeof HistoricoFinanceiroSchema>;