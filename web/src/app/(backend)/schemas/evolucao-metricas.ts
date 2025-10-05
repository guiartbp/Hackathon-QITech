import { z } from "zod";

// Schema para criação de EvolucaoMetricas
export const createEvolucaoMetricasSchema = z.object({
  empresaId: z.string().uuid("ID da empresa deve ser um UUID válido"),
  dataReferencia: z.coerce.date({
    message: "Data de referência é obrigatória",
  }),
  tipoPeriodo: z.string().min(1, "Tipo de período é obrigatório"),
  arr: z.number().positive().optional().nullable(),
  mrr: z.number().positive().optional().nullable(),
  numClientes: z.number().int().positive().optional().nullable(),
});

// Schema para atualização de EvolucaoMetricas
export const updateEvolucaoMetricasSchema = z.object({
  empresaId: z.string().uuid("ID da empresa deve ser um UUID válido").optional(),
  dataReferencia: z.coerce.date().optional(),
  tipoPeriodo: z.string().min(1, "Tipo de período é obrigatório").optional(),
  arr: z.number().positive().optional().nullable(),
  mrr: z.number().positive().optional().nullable(),
  numClientes: z.number().int().positive().optional().nullable(),
});

// Schema para query params de listagem
export const listEvolucaoMetricasSchema = z.object({
  empresaId: z.string().uuid().optional(),
  tipoPeriodo: z.string().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  orderBy: z.enum(["dataReferencia", "criadoEm"]).default("dataReferencia"),
  orderDir: z.enum(["asc", "desc"]).default("desc"),
});

// Tipos TypeScript derivados dos schemas
export type CreateEvolucaoMetricasInput = z.infer<typeof createEvolucaoMetricasSchema>;
export type UpdateEvolucaoMetricasInput = z.infer<typeof updateEvolucaoMetricasSchema>;
export type ListEvolucaoMetricasQuery = z.infer<typeof listEvolucaoMetricasSchema>;

// Schema para validação de parâmetros de rota
export const evolucaoMetricasParamsSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export type EvolucaoMetricasParams = z.infer<typeof evolucaoMetricasParamsSchema>;