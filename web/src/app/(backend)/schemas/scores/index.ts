import { z } from "zod";

export const ScoreSchema = z.object({
  empresaId: z.string().min(1, "ID da empresa é obrigatório"),
  scoreTotal: z.number().int().min(0, "Score total deve ser maior ou igual a zero"),
  tier: z.string().min(1, "Tier é obrigatório"),
  variacaoMensal: z.number().int().optional(),
  rankingPercentil: z.number().int().optional(),
  tipoScore: z.string().min(1, "Tipo de score é obrigatório"),
  metodo: z.string().optional(),
});

export type ScoreInput = z.infer<typeof ScoreSchema>;