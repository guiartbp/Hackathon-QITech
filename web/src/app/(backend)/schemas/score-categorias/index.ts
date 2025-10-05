import { z } from "zod";

export const ScoreCategoriaSchema = z.object({
  scoreId: z.string().min(1, "ID do score é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  scoreCategoria: z.number().int().min(0, "Score da categoria deve ser maior ou igual a zero"),
});

export type ScoreCategoriaInput = z.infer<typeof ScoreCategoriaSchema>;