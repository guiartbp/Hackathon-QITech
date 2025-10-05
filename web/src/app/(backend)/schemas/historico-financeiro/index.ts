import { z } from "zod";

export const HistoricoFinanceiroSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  periodo: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Período deve ser uma data válida no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)"),
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