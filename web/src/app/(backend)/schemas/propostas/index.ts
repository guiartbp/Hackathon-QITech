import { z } from "zod";

export const PropostaSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  valorSolicitado: z.number().min(0, "Valor solicitado deve ser positivo"),
  multiploCap: z.number().min(0, "Múltiplo cap deve ser positivo"),
  percentualMrr: z.number().min(0, "Percentual MRR deve ser positivo"),
  duracaoMeses: z.number().int().min(1, "Duração deve ser pelo menos 1 mês"),
  valorMinimoFunding: z.number().min(0).optional(),
  planoUsoFundos: z.string().optional(),
  statusFunding: z.string().default("RASCUNHO"),
  valorFinanciado: z.number().min(0).default(0),
  progressoFunding: z.number().min(0).max(100).default(0),
  dataAbertura: z.string().datetime().optional(),
  dataFechamento: z.string().datetime().optional(),
  diasAberta: z.number().int().optional(),
  scoreNaAbertura: z.number().int().optional(),
});

export type PropostaInput = z.infer<typeof PropostaSchema>;