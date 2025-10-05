import { z } from "zod";

export const MrrPorPlanoSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  mesReferencia: z.string().datetime("Data inválida"),
  nomePlano: z.string().min(1, "Nome do plano é obrigatório"),
  mrrPlano: z.number().min(0, "MRR do plano deve ser maior ou igual a zero"),
  numClientesPlano: z.number().int().optional(),
  percentualTotal: z.number().optional(),
});

export type MrrPorPlanoInput = z.infer<typeof MrrPorPlanoSchema>;