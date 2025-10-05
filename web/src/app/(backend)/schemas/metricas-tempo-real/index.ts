import { z } from "zod";

export const MetricasTempoRealSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  timestampCaptura: z.string().datetime().optional(),
  mrr: z.number().optional(),
  arr: z.number().optional(),
  nrr: z.number().optional(),
  usuariosAtivos: z.number().int().optional(),
  churnRate: z.number().optional(),
  opexMensal: z.number().optional(),
  ltvCacAjustado: z.number().optional(),
  dscrAjustado: z.number().optional(),
});

export type MetricasTempoRealInput = z.infer<typeof MetricasTempoRealSchema>;