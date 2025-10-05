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

// Schema estendido para criação via wizard (aceita campos adicionais)
export const PropostaWizardSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  valorSolicitado: z.number().min(0, "Valor solicitado deve ser positivo"),
  proposito: z.string().min(1, "Propósito é obrigatório"),
  detalhamento: z.string().optional(),
  connections: z.array(z.string()).min(1, "Conecte pelo menos uma API"),
  simulation: z.any(), // Dados da simulação
  multiploCap: z.number().min(0, "Múltiplo cap deve ser positivo"),
  percentualMrr: z.number().min(0, "Percentual MRR deve ser positivo"),
  duracaoMeses: z.number().int().min(1, "Duração deve ser pelo menos 1 mês").optional(),
  scoreNaAbertura: z.number().int().optional(),
});

export type PropostaInput = z.infer<typeof PropostaSchema>;
export type PropostaWizardInput = z.infer<typeof PropostaWizardSchema>;