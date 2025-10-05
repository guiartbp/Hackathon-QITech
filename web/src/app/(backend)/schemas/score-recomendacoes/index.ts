import { z } from "zod";

export const ScoreRecomendacaoSchema = z.object({
  scoreId: z.string().min(1, "ID do score é obrigatório"),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  impactoEstimado: z.number().int().optional(),
  prioridade: z.number().int().optional(),
});

export type ScoreRecomendacaoInput = z.infer<typeof ScoreRecomendacaoSchema>;