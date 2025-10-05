import { z } from "zod";

export const ProjecaoPagamentoSchema = z.object({
  contratoId: z.string().min(1, "ID do contrato é obrigatório"),
  mesReferencia: z.string().datetime("Data de referência inválida"),
  mrrProjetado: z.number().optional(),
  valorProjetado: z.number().min(0, "Valor projetado deve ser maior ou igual a zero"),
  confianca: z.number().optional(),
  metodoProjecao: z.string().optional(),
});

export type ProjecaoPagamentoInput = z.infer<typeof ProjecaoPagamentoSchema>;