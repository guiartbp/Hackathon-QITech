import { z } from "zod";

export const EvolucaoMetricasSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  dataReferencia: z.string().datetime("Data inválida"),
  tipoPeriodo: z.string().min(1, "Tipo de período é obrigatório"),
  arr: z.number().optional(),
  mrr: z.number().optional(),
  numClientes: z.number().int().optional(),
});

export type EvolucaoMetricasInput = z.infer<typeof EvolucaoMetricasSchema>;