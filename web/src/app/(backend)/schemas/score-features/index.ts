import { z } from "zod";

export const ScoreFeatureSchema = z.object({
  scoreCategoriaId: z.string().min(1, "ID da categoria do score é obrigatório"),
  featureNome: z.string().min(1, "Nome da feature é obrigatório"),
  featureValor: z.number().optional(),
  featurePeso: z.number().int().optional(),
});

export type ScoreFeatureInput = z.infer<typeof ScoreFeatureSchema>;